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
  category: 'natural' | 'historical' | 'food' | 'cultural' | 'entertainment'
  status: 'open' | 'closed' | 'maintenance'
  popularity: number
  reviews: Review[]
  nearbyTransport?: TransportationInfo[]
  nearbyAccommodations?: AccommodationInfo[]
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

// 用户类型定义
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  avatar?: string
  phone?: string
  status: 'active' | 'frozen'
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  favorites: {
    attractions: string[]
    routes: string[]
  }
  preferences?: {
    travelTypes: string[]
    budgetRange?: [number, number]
    favoriteCities: string[]
  }
  history: {
    consultations: ConsultationRecord[]
    itineraries: string[]
    bookings: string[]
  }
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
  category?: string
  status?: string
}

// 行程规划相关类型
export interface ItineraryRequest {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: {
    travelTypes: string[]
    pace: 'relaxed' | 'moderate' | 'intensive'
    interests: string[]
  }
}

export interface ItineraryDay {
  day: number
  date: string
  activities: ItineraryActivity[]
  accommodation?: AccommodationBooking
  transportation?: TransportationBooking
  estimatedCost: number
}

export interface ItineraryActivity {
  id: string
  attractionId: string
  name: string
  description: string
  startTime: string
  endTime: string
  duration: string
  cost: number
  notes?: string
}

export interface Itinerary {
  id: string
  userId: string
  name: string
  description: string
  request: ItineraryRequest
  days: ItineraryDay[]
  totalCost: number
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// 订单管理相关类型
export interface Booking {
  id: string
  userId: string
  itineraryId?: string
  type: 'attraction' | 'hotel' | 'transportation'
  itemId: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  bookingDate: string
  travelDate: string
  status: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled' | 'refunding'
  paymentMethod?: string
  paymentDate?: string
  cancellationPolicy?: string
  notes?: string
}

// AI对话相关类型
export interface ConsultationRecord {
  id: string
  userId: string
  timestamp: string
  query: string
  response: string
  intent: string
  sentiment: 'positive' | 'neutral' | 'negative'
  context?: any
}

export interface AIConversation {
  id: string
  userId: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

// 数据统计相关类型
export interface StatisticsData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  dateRange: [string, string]
  userGrowth: {
    total: number
    newUsers: number
    activeUsers: number
  }
  bookingStats: {
    total: number
    confirmed: number
    cancelled: number
    revenue: number
    refundRate: number
  }
  attractionStats: {
    mostPopular: { id: string, name: string, visits: number }[]
    highestRated: { id: string, name: string, rating: number }[]
  }
  itineraryStats: {
    totalCreated: number
    averageDuration: number
    popularDestinations: { city: string, count: number }[]
  }
}

// 其他辅助类型
export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

// 用户评论存储类型
export interface UserComment {
  id: string
  attractionId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface TransportationInfo {
  type: 'bus' | 'train' | 'taxi' | 'subway'
  name: string
  distance: string
  duration: string
  cost?: number
}

export interface AccommodationInfo {
  id: string
  name: string
  type: 'hotel' | 'inn' | 'hostel' | 'apartment'
  price: number
  rating: number
  distance: string
}

export interface AccommodationBooking {
  accommodationId: string
  name: string
  checkInDate: string
  checkOutDate: string
  rooms: number
  guests: number
  totalPrice: number
}

export interface TransportationBooking {
  type: 'flight' | 'train' | 'bus' | 'car'
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  price: number
  bookingReference?: string
}