const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',  // 修改默认密码为root
  database: process.env.DB_NAME || 'tourism_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.log('💡 提示: 请确保 MySQL 服务已启动，并运行 npm run init-db 初始化数据库');
  }
}

// 执行查询
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

module.exports = {
  pool,
  query,
  testConnection
};
