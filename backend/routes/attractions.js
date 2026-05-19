const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 获取所有景点
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    let sql = `
      SELECT a.*, 
        a.base_popularity + a.view_count * 0.1 + a.favorite_count * 2.0 + a.comment_count * 1.0 as calculated_popularity
      FROM attractions a
    `;
    let params = [];

    if (city) {
      sql += ' WHERE a.city = ?';
      params.push(city);
    }

    sql += ' ORDER BY calculated_popularity DESC';

    const attractions = await query(sql, params);

    console.log('🔍 数据库返回的景点数量:', attractions.length);
    if (attractions.length > 0) {
      console.log('🔍 第一个景点数据示例:', JSON.stringify({
        id: attractions[0].id,
        name: attractions[0].name,
        base_popularity: attractions[0].base_popularity,
        view_count: attractions[0].view_count,
        favorite_count: attractions[0].favorite_count,
        comment_count: attractions[0].comment_count,
        calculated_popularity: attractions[0].calculated_popularity
      }, null, 2));
    }

    // 解析JSON字段
    const parsedAttractions = attractions.map(attraction => ({
      ...attraction,
      images: attraction.images ? JSON.parse(attraction.images) : [],
      tags: attraction.tags ? JSON.parse(attraction.tags) : [],
      features: attraction.features ? JSON.parse(attraction.features) : [],
      coordinates: {
        lat: attraction.latitude,
        lng: attraction.longitude
      }
    }));

    res.json({
      success: true,
      data: parsedAttractions
    });
  } catch (error) {
    console.error('获取景点列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取景点列表失败: ' + error.message
    });
  }
});

// 获取热门景点 Top 5
router.get('/top', async (req, res) => {
  try {
    const sql = `
      SELECT a.*, 
        a.base_popularity + a.view_count * 0.1 + a.favorite_count * 2.0 + a.comment_count * 1.0 as calculated_popularity
      FROM attractions a
      ORDER BY calculated_popularity DESC
      LIMIT 5
    `;

    const attractions = await query(sql);

    // 解析JSON字段
    const parsedAttractions = attractions.map(attraction => ({
      ...attraction,
      images: attraction.images ? JSON.parse(attraction.images) : [],
      tags: attraction.tags ? JSON.parse(attraction.tags) : [],
      features: attraction.features ? JSON.parse(attraction.features) : [],
      coordinates: {
        lat: attraction.latitude,
        lng: attraction.longitude
      }
    }));

    res.json({
      success: true,
      data: parsedAttractions
    });
  } catch (error) {
    console.error('获取热门景点错误:', error);
    res.status(500).json({
      success: false,
      message: '获取热门景点失败: ' + error.message
    });
  }
});

// 根据城市获取景点
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;

    const sql = `
      SELECT a.*, 
        a.base_popularity + a.view_count * 0.1 + a.favorite_count * 2.0 + a.comment_count * 1.0 as calculated_popularity
      FROM attractions a
      WHERE a.city = ?
      ORDER BY calculated_popularity DESC
    `;

    const attractions = await query(sql, [city]);

    // 解析JSON字段
    const parsedAttractions = attractions.map(attraction => ({
      ...attraction,
      images: attraction.images ? JSON.parse(attraction.images) : [],
      tags: attraction.tags ? JSON.parse(attraction.tags) : [],
      features: attraction.features ? JSON.parse(attraction.features) : [],
      coordinates: {
        lat: attraction.latitude,
        lng: attraction.longitude
      }
    }));

    res.json({
      success: true,
      data: parsedAttractions
    });
  } catch (error) {
    console.error('获取城市景点错误:', error);
    res.status(500).json({
      success: false,
      message: '获取城市景点失败: ' + error.message
    });
  }
});

// 获取景点详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT a.*, 
        a.base_popularity + a.view_count * 0.1 + a.favorite_count * 2.0 + a.comment_count * 1.0 as calculated_popularity
      FROM attractions a
      WHERE a.id = ?
    `;

    const attractions = await query(sql, [id]);

    if (attractions.length === 0) {
      return res.status(404).json({
        success: false,
        message: '景点不存在'
      });
    }

    // 解析JSON字段
    const attraction = {
      ...attractions[0],
      images: attractions[0].images ? JSON.parse(attractions[0].images) : [],
      tags: attractions[0].tags ? JSON.parse(attractions[0].tags) : [],
      features: attractions[0].features ? JSON.parse(attractions[0].features) : [],
      coordinates: {
        lat: attractions[0].latitude,
        lng: attractions[0].longitude
      }
    };

    res.json({
      success: true,
      data: attraction
    });
  } catch (error) {
    console.error('获取景点详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取景点详情失败: ' + error.message
    });
  }
});

// 增加浏览次数
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    // 更新浏览次数
    await query('UPDATE attractions SET view_count = view_count + 1, updated_at = NOW() WHERE id = ?', [id]);

    // 记录热度日志
    await query(
      'INSERT INTO popularity_logs (attraction_id, action, description, old_popularity, new_popularity, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, 'view', '用户浏览', null, null]
    );

    res.json({
      success: true,
      message: '浏览次数已更新'
    });
  } catch (error) {
    console.error('增加浏览次数错误:', error);
    res.status(500).json({
      success: false,
      message: '增加浏览次数失败: ' + error.message
    });
  }
});

// 增加收藏次数
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;

    // 更新收藏次数
    await query('UPDATE attractions SET favorite_count = favorite_count + 1, updated_at = NOW() WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '收藏次数已更新'
    });
  } catch (error) {
    console.error('增加收藏次数错误:', error);
    res.status(500).json({
      success: false,
      message: '增加收藏次数失败: ' + error.message
    });
  }
});

// 获取景点热度日志
router.get('/:id/popularity-logs', async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await query(
      'SELECT * FROM popularity_logs WHERE attraction_id = ? ORDER BY created_at DESC LIMIT 20',
      [id]
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

// ==================== 管理员景点管理接口 ====================

// 添加景点（需要管理员权限）
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📝 添加景点请求:', JSON.stringify(req.body, null, 2));
    
    const {
      name,
      description,
      image_url,
      images,
      city,
      location,
      district,
      address,
      latitude,
      longitude,
      price,
      opening_hours,
      contact_phone,
      website,
      tags,
      features,
      recommended_duration,
      best_time_to_visit,
      category,
      status,
      base_popularity
    } = req.body;

    // 验证必填字段
    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: '景点名称和城市不能为空'
      });
    }

    const sql = `
      INSERT INTO attractions (
        name, description, image_url, images, city, location, district, address,
        latitude, longitude, price, rating, opening_hours, contact_phone, website,
        tags, features, recommended_duration, best_time_to_visit, category,
        status, base_popularity, view_count, favorite_count, comment_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      name,
      description ?? null,
      image_url ?? null,
      JSON.stringify(images || []),
      city,
      location ?? null,
      district ?? null,
      address ?? null,
      latitude ?? null,
      longitude ?? null,
      price ?? 0,
      0, // rating 默认值
      opening_hours ?? null,
      contact_phone ?? null,
      website ?? null,
      JSON.stringify(tags || []),
      JSON.stringify(features || []),
      recommended_duration ?? null,
      best_time_to_visit ?? null,
      category ?? null,
      status || 'open',
      base_popularity ?? 10,
      0, // view_count
      0, // favorite_count
      0  // comment_count
    ];

    console.log('📝 SQL参数:', params);
    
    const result = await query(sql, params);

    console.log('✅ 景点添加成功, ID:', result.insertId);

    res.json({
      success: true,
      message: '景点添加成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('❌ 添加景点错误:', error);
    res.status(500).json({
      success: false,
      message: '添加景点失败: ' + error.message
    });
  }
});

// 更新景点（需要管理员权限）
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      image_url,
      images,
      city,
      location,
      district,
      address,
      latitude,
      longitude,
      price,
      opening_hours,
      contact_phone,
      website,
      tags,
      features,
      recommended_duration,
      best_time_to_visit,
      category,
      status,
      base_popularity
    } = req.body;

    const sql = `
      UPDATE attractions SET
        name = ?, description = ?, image_url = ?, images = ?, city = ?,
        location = ?, district = ?, address = ?, latitude = ?, longitude = ?,
        price = ?, opening_hours = ?, contact_phone = ?, website = ?,
        tags = ?, features = ?, recommended_duration = ?, best_time_to_visit = ?,
        category = ?, status = ?, base_popularity = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      name,
      description ?? null,
      image_url ?? null,
      JSON.stringify(images || []),
      city,
      location ?? null,
      district ?? null,
      address ?? null,
      latitude ?? null,
      longitude ?? null,
      price ?? 0,
      opening_hours ?? null,
      contact_phone ?? null,
      website ?? null,
      JSON.stringify(tags || []),
      JSON.stringify(features || []),
      recommended_duration ?? null,
      best_time_to_visit ?? null,
      category ?? null,
      status,
      base_popularity ?? 10,
      id
    ];

    await query(sql, params);

    res.json({
      success: true,
      message: '景点更新成功'
    });
  } catch (error) {
    console.error('更新景点错误:', error);
    res.status(500).json({
      success: false,
      message: '更新景点失败: ' + error.message
    });
  }
});

// 删除景点（需要管理员权限）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 先删除关联的热度日志
    await query('DELETE FROM popularity_logs WHERE attraction_id = ?', [id]);
    // 删除关联的评论
    await query('DELETE FROM reviews WHERE attraction_id = ?', [id]);
    // 删除景点
    await query('DELETE FROM attractions WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '景点删除成功'
    });
  } catch (error) {
    console.error('删除景点错误:', error);
    res.status(500).json({
      success: false,
      message: '删除景点失败: ' + error.message
    });
  }
});

// 更新景点状态（上下架）
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await query('UPDATE attractions SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);

    res.json({
      success: true,
      message: '景点状态已更新'
    });
  } catch (error) {
    console.error('更新景点状态错误:', error);
    res.status(500).json({
      success: false,
      message: '更新景点状态失败: ' + error.message
    });
  }
});

module.exports = router;
