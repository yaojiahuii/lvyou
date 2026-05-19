const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// 获取用户信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, name, role, avatar, preferred_travel_types, budget_range_min, budget_range_max, favorite_cities, status, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

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

// 更新用户偏好
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferredTravelTypes, budgetRangeMin, budgetRangeMax, favoriteCities } = req.body;

    await query(
      'UPDATE users SET preferred_travel_types = ?, budget_range_min = ?, budget_range_max = ?, favorite_cities = ?, updated_at = NOW() WHERE id = ?',
      [preferredTravelTypes, budgetRangeMin, budgetRangeMax, favoriteCities, req.user.id]
    );

    res.json({
      success: true,
      message: '偏好设置已更新'
    });
  } catch (error) {
    console.error('更新用户偏好错误:', error);
    res.status(500).json({
      success: false,
      message: '更新用户偏好失败: ' + error.message
    });
  }
});

module.exports = router;
