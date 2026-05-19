const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// 获取景点的所有评价
router.get('/attraction/:attractionId', async (req, res) => {
  try {
    const { attractionId } = req.params;
    const reviews = await query(
      'SELECT * FROM reviews WHERE attraction_id = ? ORDER BY created_at DESC',
      [attractionId]
    );

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('获取评价列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取评价列表失败: ' + error.message
    });
  }
});

// 添加评价（需要登录）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { attractionId, rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || req.user.email;

    const result = await query(
      'INSERT INTO reviews (attraction_id, user_id, user_name, rating, comment, date) VALUES (?, ?, ?, ?, ?, CURDATE())',
      [attractionId, userId, userName, rating, comment]
    );

    res.status(201).json({
      success: true,
      message: '评价添加成功',
      data: {
        id: result.insertId,
        attractionId,
        userId,
        userName,
        rating,
        comment
      }
    });
  } catch (error) {
    console.error('添加评价错误:', error);
    res.status(500).json({
      success: false,
      message: '添加评价失败: ' + error.message
    });
  }
});

// 获取所有评价（仅管理员）
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reviews = await query(`
      SELECT r.*, a.name as attraction_name 
      FROM reviews r 
      LEFT JOIN attractions a ON r.attraction_id = a.id 
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('获取所有评价错误:', error);
    res.status(500).json({
      success: false,
      message: '获取评价列表失败: ' + error.message
    });
  }
});

// 删除评价（仅管理员）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '评价已删除'
    });
  } catch (error) {
    console.error('删除评价错误:', error);
    res.status(500).json({
      success: false,
      message: '删除评价失败: ' + error.message
    });
  }
});

module.exports = router;
