// 景点类型定义
export interface Attraction {
  id: string
  name: string
  description: string
  location: string
  city: string
  images: string[]
  rating: number
  price: number
  openingHours: string
  phone: string
  website?: string
  coordinates: {
    lat: number
    lng: number
  }
  tags: string[]
  features: string[]
  recommendedDuration: string
  bestTimeToVisit: string
}

// 路线类型定义
export interface Route {
  id: string
  name: string
  description: string
  attractions: string[]
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  distance: number
  tags: string[]
}

// 天气信息类型
export interface WeatherInfo {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

// 用户收藏类型
export interface UserFavorite {
  id: string
  attractionId: string
  addedAt: Date
}

// 搜索过滤器类型
export interface SearchFilters {
  city?: string
  priceRange?: [number, number]
  rating?: number
  tags?: string[]
}

