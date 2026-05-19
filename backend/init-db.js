require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  let connection;
  
  try {
    // 先连接到 MySQL（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root'  // 修改默认密码为root
    });

    console.log('✅ 已连接到 MySQL 服务器');

    // 创建数据库
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'tourism_platform'} 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log('✅ 数据库创建成功');

    // 使用数据库
    await connection.changeUser({ database: process.env.DB_NAME || 'tourism_platform' });

    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        avatar VARCHAR(255),
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        preferred_travel_types VARCHAR(255),
        budget_range_min INT DEFAULT 0,
        budget_range_max INT DEFAULT 10000,
        favorite_cities VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 用户表创建成功');

    // 创建景点表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attractions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        images TEXT,
        city VARCHAR(50) NOT NULL,
        location VARCHAR(255),
        district VARCHAR(50),
        address VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        price DECIMAL(10, 2),
        rating DECIMAL(2, 1),
        opening_hours VARCHAR(100),
        contact_phone VARCHAR(20),
        website VARCHAR(255),
        tags TEXT,
        features TEXT,
        recommended_duration VARCHAR(50),
        best_time_to_visit VARCHAR(100),
        category VARCHAR(50),
        status VARCHAR(20) DEFAULT 'open',
        base_popularity DOUBLE DEFAULT 0,
        view_count INT DEFAULT 0,
        favorite_count INT DEFAULT 0,
        comment_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 景点表创建成功');

    // 创建路线表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        attractions TEXT,
        duration VARCHAR(50),
        difficulty VARCHAR(20),
        distance INT DEFAULT 0,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ 路线表创建成功');

    // 创建评价表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        attraction_id INT NOT NULL,
        user_id INT,
        user_name VARCHAR(100),
        rating INT,
        comment TEXT,
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attraction_id) REFERENCES attractions(id)
      )
    `);
    console.log('✅ 评价表创建成功');

    // 创建热度日志表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS popularity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        attraction_id INT NOT NULL,
        user_id INT,
        action VARCHAR(50) NOT NULL,
        description TEXT,
        old_popularity DOUBLE,
        new_popularity DOUBLE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attraction_id) REFERENCES attractions(id)
      )
    `);
    console.log('✅ 热度日志表创建成功');

    // 插入示例管理员账户
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    await connection.execute(
      `INSERT IGNORE INTO users (email, password, name, role, status) 
       VALUES ('admin@tourism.com', ?, '系统管理员', 'admin', 'active')`,
      [hashedPassword]
    );
    console.log('✅ 管理员账户创建成功 (admin@tourism.com / Admin123)');

    // 插入示例用户账户
    const userPassword = await bcrypt.hash('User123', 10);
    await connection.execute(
      `INSERT IGNORE INTO users (email, password, name, role, status) 
       VALUES ('user1@tourism.com', ?, '张三', 'user', 'active')`,
      [userPassword]
    );
    console.log('✅ 示例用户账户创建成功 (user1@tourism.com / User123)');

    // 插入示例景点数据
    const sampleAttractions = [
      ['黄鹤楼', '黄鹤楼是武汉市的标志性建筑，享有"天下江山第一楼"的美誉。楼高五层，飞檐翘角，气势雄伟。登楼远眺，长江汉水尽收眼底，是武汉最著名的旅游景点。', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', JSON.stringify(['https://images.unsplash.com/photo-1548013146-72479768bada?w=800', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800']), '武汉', '武汉市武昌区蛇山西山坡特1号', '武昌区', '武汉市武昌区蛇山西山坡特1号', 30.545, 114.295, 70.00, 4.8, '08:00-18:00', '027-88875096', 'http://www.hhl.com.cn', JSON.stringify(['历史建筑', '文化古迹', '登高望远']), JSON.stringify(['免费WiFi', '停车场', '导游服务', '纪念品商店']), '2-3小时', '春秋两季', 'historical', 95.0],
      ['武当山', '武当山是中国道教圣地，被誉为"亘古无双胜境，天下第一仙山"。山势雄伟，古建筑群规模宏大，是道教文化的重要发源地。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800']), '十堰', '十堰市丹江口市武当山特区', null, '十堰市丹江口市武当山特区', 32.667, 111.004, 240.00, 4.9, '07:00-18:00', '0719-5689188', 'http://www.wudangshan.com', JSON.stringify(['道教圣地', '世界遗产', '古建筑', '武术发源地']), JSON.stringify(['索道', '住宿', '餐饮', '导游服务']), '1-2天', '四季皆宜', 'cultural', 92.0],
      ['三峡大坝', '三峡大坝是世界上最大的水利工程，也是中国重要的旅游景点。大坝雄伟壮观，展现了人类改造自然的伟大力量。', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', JSON.stringify(['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800']), '宜昌', '宜昌市夷陵区三斗坪镇', '夷陵区', '宜昌市夷陵区三斗坪镇', 30.823, 111.003, 105.00, 4.7, '08:00-17:30', '0717-6763498', 'http://www.ctg.com.cn', JSON.stringify(['水利工程', '现代建筑', '科普教育']), JSON.stringify(['观景台', '展览馆', '停车场', '导游服务']), '3-4小时', '春秋两季', 'cultural', 88.0],
      ['神农架', '神农架是中国唯一以"林区"命名的行政区划，拥有丰富的动植物资源和原始森林景观，是探索自然奥秘的绝佳去处。', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', JSON.stringify(['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'https://images.unsplash.com/photo-1440581572329-cee517e90f81?w=800']), '神农架', '神农架林区', null, '神农架林区', 31.744, 110.676, 130.00, 4.6, '08:00-17:00', '0719-3456789', null, JSON.stringify(['自然保护区', '原始森林', '野生动物', '生态旅游']), JSON.stringify(['住宿', '餐饮', '导游服务', '观鸟']), '2-3天', '夏季避暑', 'natural', 85.0],
      ['恩施大峡谷', '恩施大峡谷被誉为"地球上最美丽的伤痕"，拥有壮观的峡谷地貌和独特的土家族文化，是摄影爱好者的天堂。', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', JSON.stringify(['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800']), '恩施', '恩施市沐抚办事处', null, '恩施市沐抚办事处', 30.318, 109.484, 200.00, 4.8, '08:00-17:00', '0718-8542333', null, JSON.stringify(['峡谷地貌', '土家族文化', '摄影圣地', '户外探险']), JSON.stringify(['索道', '住宿', '餐饮', '民族表演']), '1-2天', '春秋两季', 'natural', 90.0],
      ['东湖', '东湖是武汉市最大的城中湖，湖光山色，风景秀丽。春天樱花盛开，夏天荷花满池，是市民休闲娱乐的好去处。', 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800', JSON.stringify(['https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800']), '武汉', '武汉市武昌区东湖路', '武昌区', '武汉市武昌区东湖路', 30.545, 114.365, 0.00, 4.5, '全天开放', '027-86773706', null, JSON.stringify(['城中湖', '樱花', '荷花', '休闲娱乐']), JSON.stringify(['游船', '自行车租赁', '餐饮', '停车场']), '半天', '春季赏樱', 'natural', 82.0],
      ['古隆中', '古隆中是三国时期诸葛亮隐居的地方，也是"三顾茅庐"故事的发生地。这里保存着丰富的历史文化遗迹。', 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800', JSON.stringify(['https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800']), '襄阳', '襄阳市襄城区隆中路461号', '襄城区', '襄阳市襄城区隆中路461号', 32.018, 112.144, 67.00, 4.4, '08:00-17:30', '0710-3590010', null, JSON.stringify(['三国文化', '历史遗迹', '诸葛亮', '古建筑']), JSON.stringify(['导游服务', '停车场', '纪念品商店']), '2-3小时', '四季皆宜', 'historical', 78.0],
      ['赤壁古战场', '赤壁古战场是三国时期著名的赤壁之战发生地，保存着丰富的历史遗迹和文化景观，是了解三国历史的重要场所。', 'https://images.unsplash.com/photo-1599939571322-792a326991f2?w=800', JSON.stringify(['https://images.unsplash.com/photo-1599939571322-792a326991f2?w=800', 'https://images.unsplash.com/photo-15893633698843-69a4790f6dd7?w=800']), '赤壁', '赤壁市赤壁镇', null, '赤壁市赤壁镇', 29.904, 113.904, 60.00, 4.3, '08:00-17:00', '0715-5350000', null, JSON.stringify(['三国文化', '历史遗迹', '古战场', '文化教育']), JSON.stringify(['导游服务', '停车场', '展览馆']), '2-3小时', '四季皆宜', 'historical', 75.0]
    ];

    for (const attraction of sampleAttractions) {
      await connection.execute(
        `INSERT IGNORE INTO attractions 
         (name, description, image_url, images, city, location, district, address, latitude, longitude, price, rating, opening_hours, contact_phone, website, tags, features, recommended_duration, best_time_to_visit, category, base_popularity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        attraction
      );
    }
    console.log('✅ 示例景点数据插入成功（8个景点）');

    // 插入路线数据
    const routes = [
      ['武汉经典一日游', '游览武汉最著名的景点，体验江城魅力', JSON.stringify(['1', '6']), '1天', 'easy', 15, JSON.stringify(['经典路线', '一日游', '文化古迹'])],
      ['武当山朝圣之旅', '深度体验道教文化，感受武当山的仙山灵气', JSON.stringify(['2']), '2天', 'medium', 0, JSON.stringify(['道教文化', '朝圣', '古建筑'])],
      ['三峡大坝科技游', '参观世界级水利工程，了解现代科技成就', JSON.stringify(['3']), '1天', 'easy', 0, JSON.stringify(['科技教育', '现代工程', '科普'])],
      ['恩施大峡谷探险', '探索壮观的峡谷地貌，体验土家族文化', JSON.stringify(['5']), '2天', 'hard', 0, JSON.stringify(['户外探险', '峡谷地貌', '民族文化'])]
    ];

    for (const route of routes) {
      await connection.execute(
        `INSERT IGNORE INTO routes 
         (name, description, attractions, duration, difficulty, distance, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        route
      );
    }
    console.log('✅ 示例路线数据插入成功（4条路线）');

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📝 测试账户信息：');
    console.log('   管理员: admin@tourism.com / Admin123');
    console.log('   普通用户: user1@tourism.com / User123');
    console.log('\n💡 现在可以运行 npm start 启动后端服务器了');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.log('\n💡 请检查：');
    console.log('   1. MySQL 服务是否已启动');
    console.log('   2. .env 文件中的数据库配置是否正确');
    console.log('   3. 数据库用户名和密码是否正确');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
