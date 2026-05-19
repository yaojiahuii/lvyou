require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./config/database');

// 导入路由
const authRoutes = require('./routes/auth');
const attractionRoutes = require('./routes/attractions');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const routeRoutes = require('./routes/routes');
const reviewRoutes = require('./routes/reviews');
const aiRoutes = require('./routes/ai');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 上传的图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 图片上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// 图片上传API
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '请选择要上传的图片'
    });
  }
  const fileUrl = `http://localhost:8080/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: '图片上传成功',
    data: {
      url: fileUrl,
      filename: req.file.filename
    }
  });
});

// 多图片上传API
app.post('/api/uploads', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: '请选择要上传的图片'
    });
  }
  const urls = req.files.map(file => `http://localhost:8080/uploads/${file.filename}`);
  res.json({
    success: true,
    message: '图片上传成功',
    data: urls
  });
});

// 测试数据库连接
db.testConnection();

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '湖北智能旅游平台后端运行中',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

// 启动服务器
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📚 API 文档: http://localhost:${PORT}/api/health`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
});
