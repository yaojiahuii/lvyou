const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { authenticateToken, generateToken } = require('../middleware/auth');

// 存储验证码（生产环境应使用 Redis）
const verificationCodes = new Map();

// 生成6位验证码
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送验证码
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱不能为空'
      });
    }

    // 检查用户是否存在
    const users = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '该邮箱未注册'
      });
    }

    // 生成验证码
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10分钟后过期

    // 存储验证码
    verificationCodes.set(email, { code, expiresAt });

    console.log('========================================');
    console.log(`📧 验证码已发送至: ${email}`);
    console.log(`🔑 验证码: ${code}`);
    console.log('========================================');

    // TODO: 生产环境应发送真实邮件
    // 此处仅返回验证码用于测试
    res.json({
      success: true,
      message: '验证码已发送，请注意查收',
      // 开发环境下返回验证码方便测试
      data: process.env.NODE_ENV === 'development' ? { code } : null
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败: ' + error.message
    });
  }
});

// 验证验证码
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱和验证码不能为空'
      });
    }

    const stored = verificationCodes.get(email);

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: '验证码已过期，请重新获取'
      });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        message: '验证码已过期，请重新获取'
      });
    }

    if (stored.code !== code) {
      return res.status(400).json({
        success: false,
        message: '验证码错误'
      });
    }

    // 验证成功后删除验证码
    verificationCodes.delete(email);

    res.json({
      success: true,
      message: '验证成功'
    });
  } catch (error) {
    console.error('验证验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '验证失败: ' + error.message
    });
  }
});

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // 验证必填字段
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '邮箱、密码和姓名为必填项'
      });
    }

    // 检查邮箱是否已存在
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户
    const result = await query(
      'INSERT INTO users (email, password, name, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, name, role, 'active']
    );

    // 返回用户信息
    const newUser = {
      id: result.insertId,
      email,
      name,
      role,
      status: 'active'
    };

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: newUser
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败: ' + error.message
    });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项'
      });
    }

    // 查找用户
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    const user = users[0];

    // 检查账户状态
    if (user.status === 'frozen') {
      return res.status(403).json({
        success: false,
        message: '账户已被冻结，请联系客服'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成 JWT Token
    const token = generateToken(user);

    // 返回用户信息和 Token
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败: ' + error.message
    });
  }
});

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const users = await query('SELECT id, email, name, role, avatar, status, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败: ' + error.message
    });
  }
});

// 修改密码
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 获取用户
    const users = await query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[0];

    // 验证旧密码
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '原密码错误'
      });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败: ' + error.message
    });
  }
});

// 重置密码
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 检查用户是否存在
    const users = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '该邮箱未注册'
      });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?', [hashedPassword, email]);

    res.json({
      success: true,
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({
      success: false,
      message: '重置密码失败: ' + error.message
    });
  }
});

// 检查邮箱是否存在
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;

    const users = await query('SELECT id FROM users WHERE email = ?', [email]);

    res.json({
      success: true,
      data: {
        exists: users.length > 0
      }
    });
  } catch (error) {
    console.error('检查邮箱错误:', error);
    res.status(500).json({
      success: false,
      message: '检查邮箱失败: ' + error.message
    });
  }
});

module.exports = router;
