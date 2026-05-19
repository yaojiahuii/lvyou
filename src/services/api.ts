import axios from 'axios'
import type { Attraction, User, PopularityData } from '../types'

// API 基础配置
const API_BASE_URL = 'http://localhost:8080/api'
const UPLOAD_URL = 'http://localhost:8080/api/upload'
const UPLOADS_URL = 'http://localhost:8080/api/uploads'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除本地存储
      localStorage.removeItem('token')
      sessionStorage.removeItem('currentUser')

      // 如果不是在登录页面，才跳转到登录页
      // 避免登录失败时刷新页面导致表单数据丢失
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error.response?.data || error)
  }
)

// API 服务类
export class ApiService {
  // 认证相关
  static async register(userData: {
    email: string
    password: string
    name: string
    role?: string
  }) {
    return apiClient.post('/auth/register', userData)
  }

  static async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', credentials)
    if (response.success && response.data) {
      // 保存 token 和用户信息
      localStorage.setItem('token', response.data.token)
      sessionStorage.setItem('currentUser', JSON.stringify(response.data.user))
    }
    return response
  }

  static async getCurrentUser() {
    return apiClient.get('/auth/me')
  }

  static async changePassword(oldPassword: string, newPassword: string) {
    return apiClient.post('/auth/change-password', null, {
      params: { oldPassword, newPassword }
    })
  }

  static async resetPassword(email: string, newPassword: string) {
    return apiClient.post('/auth/reset-password', { email, newPassword })
  }

  static async sendVerificationCode(email: string) {
    return apiClient.post('/auth/send-code', { email })
  }

  static async verifyCode(email: string, code: string) {
    return apiClient.post('/auth/verify-code', { email, code })
  }

  static async checkEmail(email: string) {
    return apiClient.get('/auth/check-email', {
      params: { email }
    })
  }

  // 景点相关
  static async getAllAttractions(): Promise<Attraction[]> {
    const response = await apiClient.get('/attractions')
    return response.success ? response.data : []
  }

  static async getAttractionById(id: string): Promise<Attraction | null> {
    try {
      const response = await apiClient.get(`/attractions/${id}`)
      return response.success ? response.data : null
    } catch {
      return null
    }
  }

  static async getTopAttractions(): Promise<Attraction[]> {
    const response = await apiClient.get('/attractions/top')
    return response.success ? response.data : []
  }

  static async getAttractionsByCity(city: string): Promise<Attraction[]> {
    const response = await apiClient.get(`/attractions/city/${city}`)
    return response.success ? response.data : []
  }

  // 热度值相关操作
  static async increaseViewCount(attractionId: string) {
    return apiClient.post(`/attractions/${attractionId}/view`)
  }

  static async increaseFavoriteCount(attractionId: string) {
    return apiClient.post(`/attractions/${attractionId}/favorite`)
  }

  static async getPopularityLogs(attractionId: string) {
    const response = await apiClient.get(`/attractions/${attractionId}/popularity-logs`)
    return response.success ? response.data : []
  }

  // 管理员功能
  static async adminAdjustPopularity(attractionId: string, newPopularity: number, reason: string) {
    return apiClient.put(`/admin/attractions/${attractionId}/popularity`, {
      newPopularity,
      reason
    })
  }

  static async getAdminPopularityLogs() {
    const response = await apiClient.get('/admin/popularity-logs')
    return response.success ? response.data : []
  }

  // 管理员 - 用户管理
  static async getAllUsers() {
    const response = await apiClient.get('/admin/users')
    return response.success ? response.data : []
  }

  static async updateUserRole(userId: string, role: string) {
    return apiClient.put(`/admin/users/${userId}/role`, { role })
  }

  static async updateUserStatus(userId: string, status: string) {
    return apiClient.put(`/admin/users/${userId}/status`, { status })
  }

  static async deleteUser(userId: string) {
    return apiClient.delete(`/admin/users/${userId}`)
  }

  static async resetUserPassword(userId: string, newPassword: string) {
    return apiClient.put(`/admin/users/${userId}/password`, { newPassword })
  }

  static async getSystemStatistics() {
    const response = await apiClient.get('/admin/statistics')
    return response.success ? response.data : null
  }

  // 路线相关
  static async getAllRoutes() {
    const response = await apiClient.get('/routes')
    return response.success ? response.data : []
  }

  static async getRouteById(id: string) {
    const response = await apiClient.get(`/routes/${id}`)
    return response.success ? response.data : null
  }

  // 评价相关
  static async getReviewsByAttraction(attractionId: string) {
    const response = await apiClient.get(`/reviews/attraction/${attractionId}`)
    return response.success ? response.data : []
  }

  static async addReview(attractionId: string, rating: number, comment: string) {
    return apiClient.post('/reviews', {
      attractionId,
      rating,
      comment
    })
  }

  // 评价管理（管理员）
  static async getAllReviews() {
    const response = await apiClient.get('/reviews/all')
    return response.success ? response.data : []
  }

  static async deleteReview(reviewId: string) {
    return apiClient.delete(`/reviews/${reviewId}`)
  }

  // 景点管理（管理员）
  static async createAttraction(attractionData: {
    name: string
    description?: string
    image_url?: string
    images?: string[]
    city: string
    location?: string
    district?: string
    address?: string
    latitude?: number
    longitude?: number
    price?: number
    opening_hours?: string
    contact_phone?: string
    website?: string
    tags?: string[]
    features?: string[]
    recommended_duration?: string
    best_time_to_visit?: string
    category?: string
    status?: string
    base_popularity?: number
  }) {
    return apiClient.post('/attractions', attractionData)
  }

  static async updateAttraction(id: string, attractionData: any) {
    return apiClient.put(`/attractions/${id}`, attractionData)
  }

  static async deleteAttraction(id: string) {
    return apiClient.delete(`/attractions/${id}`)
  }

  static async updateAttractionStatus(id: string, status: string) {
    return apiClient.put(`/attractions/${id}/status`, { status })
  }

  // 图片上传
  static async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)
    const token = localStorage.getItem('token')
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
    return response.data
  }

  static async uploadImages(files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    const token = localStorage.getItem('token')
    const response = await axios.post(UPLOADS_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
    return response.data
  }

  // AI对话相关
  static async chatWithAI(messages: Array<{ role: string; content: string }>) {
    return apiClient.post('/ai/chat', { messages })
  }
}

// 导出默认实例
export default apiClient