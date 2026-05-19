import type { Attraction, Review } from '../types'

// 用户评价数据
const sampleReviews: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: '旅行爱好者',
    rating: 5,
    comment: '非常棒的景点，历史文化氛围浓厚，导游讲解很专业！',
    date: '2024-10-15'
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: '摄影达人',
    rating: 4,
    comment: '风景很美，适合拍照，就是人有点多。',
    date: '2024-10-10'
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: '家庭游客',
    rating: 4,
    comment: '带孩子来学习历史知识，很有教育意义。',
    date: '2024-10-05'
  }
]

export const attractions: Attraction[] = [
  {
    id: '1',
    name: '黄鹤楼',
    description: '黄鹤楼是武汉市的标志性建筑，享有"天下江山第一楼"的美誉。楼高五层，飞檐翘角，气势雄伟。登楼远眺，长江汉水尽收眼底，是武汉最著名的旅游景点。',
    location: '武汉市武昌区蛇山西山坡特1号',
    city: '武汉',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    rating: 4.8,
    price: 70,
    openingHours: '08:00-18:00',
    phone: '027-88875096',
    website: 'http://www.hhl.com.cn',
    coordinates: { lat: 30.545, lng: 114.295 },
    tags: ['历史建筑', '文化古迹', '登高望远'],
    features: ['免费WiFi', '停车场', '导游服务', '纪念品商店'],
    recommendedDuration: '2-3小时',
    bestTimeToVisit: '春秋两季',
    category: 'historical',
    status: 'open',
    popularity: 95,
    reviews: sampleReviews
  },
  {
    id: '2',
    name: '武当山',
    description: '武当山是中国道教圣地，被誉为"亘古无双胜境，天下第一仙山"。山势雄伟，古建筑群规模宏大，是道教文化的重要发源地。',
    location: '十堰市丹江口市武当山特区',
    city: '十堰',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'
    ],
    rating: 4.9,
    price: 240,
    openingHours: '07:00-18:00',
    phone: '0719-5689188',
    website: 'http://www.wudangshan.com',
    coordinates: { lat: 32.667, lng: 111.004 },
    tags: ['道教圣地', '世界遗产', '古建筑', '武术发源地'],
    features: ['索道', '住宿', '餐饮', '导游服务'],
    recommendedDuration: '1-2天',
    bestTimeToVisit: '四季皆宜',
    category: 'cultural',
    status: 'open',
    popularity: 92,
    reviews: sampleReviews
  },
  {
    id: '3',
    name: '三峡大坝',
    description: '三峡大坝是世界上最大的水利工程，也是中国重要的旅游景点。大坝雄伟壮观，展现了人类改造自然的伟大力量。',
    location: '宜昌市夷陵区三斗坪镇',
    city: '宜昌',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
    ],
    rating: 4.7,
    price: 105,
    openingHours: '08:00-17:30',
    phone: '0717-6763498',
    website: 'http://www.ctg.com.cn',
    coordinates: { lat: 30.823, lng: 111.003 },
    tags: ['水利工程', '现代建筑', '科普教育'],
    features: ['观景台', '展览馆', '停车场', '导游服务'],
    recommendedDuration: '3-4小时',
    bestTimeToVisit: '春秋两季',
    category: 'cultural',
    status: 'open',
    popularity: 88,
    reviews: sampleReviews
  },
  {
    id: '4',
    name: '神农架',
    description: '神农架是中国唯一以"林区"命名的行政区划，拥有丰富的动植物资源和原始森林景观，是探索自然奥秘的绝佳去处。',
    location: '神农架林区',
    city: '神农架',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1440581572329-cee517e90f81?w=800'
    ],
    rating: 4.6,
    price: 130,
    openingHours: '08:00-17:00',
    phone: '0719-3456789',
    coordinates: { lat: 31.744, lng: 110.676 },
    tags: ['自然保护区', '原始森林', '野生动物', '生态旅游'],
    features: ['住宿', '餐饮', '导游服务', '观鸟'],
    recommendedDuration: '2-3天',
    bestTimeToVisit: '夏季避暑',
    category: 'natural',
    status: 'open',
    popularity: 85,
    reviews: sampleReviews
  },
  {
    id: '5',
    name: '恩施大峡谷',
    description: '恩施大峡谷被誉为"地球上最美丽的伤痕"，拥有壮观的峡谷地貌和独特的土家族文化，是摄影爱好者的天堂。',
    location: '恩施市沐抚办事处',
    city: '恩施',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
    ],
    rating: 4.8,
    price: 200,
    openingHours: '08:00-17:00',
    phone: '0718-8542333',
    coordinates: { lat: 30.318, lng: 109.484 },
    tags: ['峡谷地貌', '土家族文化', '摄影圣地', '户外探险'],
    features: ['索道', '住宿', '餐饮', '民族表演'],
    recommendedDuration: '1-2天',
    bestTimeToVisit: '春秋两季',
    category: 'natural',
    status: 'open',
    popularity: 90,
    reviews: sampleReviews
  },
  {
    id: '6',
    name: '东湖',
    description: '东湖是武汉市最大的城中湖，湖光山色，风景秀丽。春天樱花盛开，夏天荷花满池，是市民休闲娱乐的好去处。',
    location: '武汉市武昌区东湖路',
    city: '武汉',
    images: [
      'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    rating: 4.5,
    price: 0,
    openingHours: '全天开放',
    phone: '027-86773706',
    coordinates: { lat: 30.545, lng: 114.365 },
    tags: ['城中湖', '樱花', '荷花', '休闲娱乐'],
    features: ['游船', '自行车租赁', '餐饮', '停车场'],
    recommendedDuration: '半天',
    bestTimeToVisit: '春季赏樱',
    category: 'natural',
    status: 'open',
    popularity: 82,
    reviews: sampleReviews
  },
  {
    id: '7',
    name: '古隆中',
    description: '古隆中是三国时期诸葛亮隐居的地方，也是"三顾茅庐"故事的发生地。这里保存着丰富的历史文化遗迹。',
    location: '襄阳市襄城区隆中路461号',
    city: '襄阳',
    images: [
      'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'
    ],
    rating: 4.4,
    price: 67,
    openingHours: '08:00-17:30',
    phone: '0710-3590010',
    coordinates: { lat: 32.018, lng: 112.144 },
    tags: ['三国文化', '历史遗迹', '诸葛亮', '古建筑'],
    features: ['导游服务', '停车场', '纪念品商店'],
    recommendedDuration: '2-3小时',
    bestTimeToVisit: '四季皆宜',
    category: 'historical',
    status: 'open',
    popularity: 78,
    reviews: sampleReviews
  },
  {
    id: '8',
    name: '赤壁古战场',
    description: '赤壁古战场是三国时期著名的赤壁之战发生地，保存着丰富的历史遗迹和文化景观，是了解三国历史的重要场所。',
    location: '赤壁市赤壁镇',
    city: '赤壁',
    images: [
      'https://images.unsplash.com/photo-1599939571322-792a326991f2?w=800',
      'https://images.unsplash.com/photo-15893633698843-69a4790f6dd7?w=800'
    ],
    rating: 4.3,
    price: 60,
    openingHours: '08:00-17:00',
    phone: '0715-5350000',
    coordinates: { lat: 29.904, lng: 113.904 },
    tags: ['三国文化', '历史遗迹', '古战场', '文化教育'],
    features: ['导游服务', '停车场', '展览馆'],
    recommendedDuration: '2-3小时',
    bestTimeToVisit: '四季皆宜',
    category: 'historical',
    status: 'open',
    popularity: 75,
    reviews: sampleReviews
  }
]

export const routes = [
  {
    id: '1',
    name: '武汉经典一日游',
    description: '游览武汉最著名的景点，体验江城魅力',
    attractions: ['1', '6'],
    duration: '1天',
    difficulty: 'easy' as const,
    distance: 15,
    tags: ['经典路线', '一日游', '文化古迹']
  },
  {
    id: '2',
    name: '武当山朝圣之旅',
    description: '深度体验道教文化，感受武当山的仙山灵气',
    attractions: ['2'],
    duration: '2天',
    difficulty: 'medium' as const,
    distance: 0,
    tags: ['道教文化', '朝圣', '古建筑']
  },
  {
    id: '3',
    name: '三峡大坝科技游',
    description: '参观世界级水利工程，了解现代科技成就',
    attractions: ['3'],
    duration: '1天',
    difficulty: 'easy' as const,
    distance: 0,
    tags: ['科技教育', '现代工程', '科普']
  },
  {
    id: '4',
    name: '恩施大峡谷探险',
    description: '探索壮观的峡谷地貌，体验土家族文化',
    attractions: ['5'],
    duration: '2天',
    difficulty: 'hard' as const,
    distance: 0,
    tags: ['户外探险', '峡谷地貌', '民族文化']
  }
]