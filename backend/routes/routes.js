const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// 获取所有路线
router.get('/', async (req, res) => {
  try {
    const routes = await query('SELECT * FROM routes ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('获取路线列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取路线列表失败: ' + error.message
    });
  }
});

// 获取路线详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const routes = await query('SELECT * FROM routes WHERE id = ?', [id]);
    
    if (routes.length === 0) {
      return res.status(404).json({
        success: false,
        message: '路线不存在'
      });
    }

    res.json({
      success: true,
      data: routes[0]
    });
  } catch (error) {
    console.error('获取路线详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取路线详情失败: ' + error.message
    });
  }
});

module.exports = router;
