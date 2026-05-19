const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// 获取所有用户（仅管理员）
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, name, role, avatar, status, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败: ' + error.message
    });
  }
});

// 更新用户角色（仅管理员）
router.put('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: '无效的角色类型'
      });
    }

    await query('UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?', [role, id]);

    res.json({
      success: true,
      message: '用户角色已更新'
    });
  } catch (error) {
    console.error('更新用户角色错误:', error);
    res.status(500).json({
      success: false,
      message: '更新用户角色失败: ' + error.message
    });
  }
});

// 更新用户状态（仅管理员）
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'frozen'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态类型'
      });
    }

    await query('UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: '用户状态已更新'
    });
  } catch (error) {
    console.error('更新用户状态错误:', error);
    res.status(500).json({
      success: false,
      message: '更新用户状态失败: ' + error.message
    });
  }
});

// 删除用户（仅管理员）
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 不能删除自己
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能删除自己的账户'
      });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '用户已删除'
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败: ' + error.message
    });
  }
});

// 重置用户密码（仅管理员）
router.put('/users/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度不能少于6位'
      });
    }

    // 不能重置自己的密码
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能重置自己的密码'
      });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, id]);

    res.json({
      success: true,
      message: '用户密码已重置'
    });
  } catch (error) {
    console.error('重置用户密码错误:', error);
    res.status(500).json({
      success: false,
      message: '重置用户密码失败: ' + error.message
    });
  }
});

// 获取系统统计（仅管理员）
router.get('/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const usersCount = await query('SELECT COUNT(*) as count FROM users');
    const adminsCount = await query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    const attractionsCount = await query('SELECT COUNT(*) as count FROM attractions');
    const routesCount = await query('SELECT COUNT(*) as count FROM routes');

    res.json({
      success: true,
      data: {
        totalUsers: usersCount[0].count,
        totalAdmins: adminsCount[0].count,
        totalAttractions: attractionsCount[0].count,
        totalRoutes: routesCount[0].count
      }
    });
  } catch (error) {
    console.error('获取系统统计错误:', error);
    res.status(500).json({
      success: false,
      message: '获取系统统计失败: ' + error.message
    });
  }
});

// 调整景点基础热度值（仅管理员）
router.put('/attractions/:id/popularity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPopularity, reason } = req.body;

    if (newPopularity === undefined || newPopularity < 0) {
      return res.status(400).json({
        success: false,
        message: '无效的热度值'
      });
    }

    // 获取当前热度值
    const current = await query(
      'SELECT base_popularity FROM attractions WHERE id = ?',
      [id]
    );

    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: '景点不存在'
      });
    }

    const oldPopularity = current[0].base_popularity;

    // 更新热度值
    await query(
      'UPDATE attractions SET base_popularity = ?, updated_at = NOW() WHERE id = ?',
      [newPopularity, id]
    );

    // 记录热度变更日志
    await query(
      'INSERT INTO popularity_logs (attraction_id, action, description, old_popularity, new_popularity, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, 'admin_adjust', reason || '管理员手动调整', oldPopularity, newPopularity]
    );

    res.json({
      success: true,
      message: '热度值已更新'
    });
  } catch (error) {
    console.error('调整热度值错误:', error);
    res.status(500).json({
      success: false,
      message: '调整热度值失败: ' + error.message
    });
  }
});

// 获取热度日志（仅管理员）
router.get('/popularity-logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const logs = await query(
      'SELECT pl.*, a.name as attraction_name FROM popularity_logs pl LEFT JOIN attractions a ON pl.attraction_id = a.id ORDER BY pl.created_at DESC LIMIT 50'
    );

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('获取热度日志错误:', error);
    res.status(500).json({
      success: false,
      message: '获取热度日志失败: ' + error.message
    });
  }
});

module.exports = router;
