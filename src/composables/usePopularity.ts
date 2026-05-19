import { ref, computed } from 'vue'
import type { Attraction } from '../types'
import { ApiService } from '../services/api'

// 热度数据存储结构
interface PopularityData {
  id: string
  basePopularity: number
  viewCount: number
  favoriteCount: number
  commentCount: number
  calculatedPopularity: number
}

interface PopularityLog {
  id: string
  attractionId: string
  userId?: string
  action: string
  description: string
  oldPopularity: number
  newPopularity: number
  createdAt: string
}

// 响应式数据
const attractions = ref<Attraction[]>([])
const popularityData = ref<Map<string, PopularityData>>(new Map())

// 加载景点数据
const loadAttractions = async (): Promise<Attraction[]> => {
  try {
    const data = await ApiService.getAllAttractions()
    attractions.value = data
    
    // 初始化热度数据映射（后端返回 snake_case 字段）
    data.forEach(attraction => {
      const basePop = (attraction as any).base_popularity || (attraction as any).basePopularity || 0
      const viewCount = (attraction as any).view_count || (attraction as any).viewCount || 0
      const favoriteCount = (attraction as any).favorite_count || (attraction as any).favoriteCount || 0
      const commentCount = (attraction as any).comment_count || (attraction as any).commentCount || 0
      const calcPop = (attraction as any).calculated_popularity || (attraction as any).calculatedPopularity || 0
      
      console.log(`📊 景点[${attraction.id}] ${attraction.name}: base_popularity=${basePop}, calculated_popularity=${calcPop}`)
      
      popularityData.value.set(attraction.id.toString(), {
        id: attraction.id.toString(),
        basePopularity: basePop,
        viewCount: viewCount,
        favoriteCount: favoriteCount,
        commentCount: commentCount,
        calculatedPopularity: calcPop
      })
    })
    
    console.log('📊 热度数据 Map 大小:', popularityData.value.size)
    
    return data
  } catch (error) {
    console.error('加载景点数据失败:', error)
    return []
  }
}

// 获取单个景点详情
const getAttractionById = async (id: string): Promise<Attraction | null> => {
  try {
    const attraction = await ApiService.getAttractionById(id)
    if (attraction) {
      // 更新热度数据（后端返回 snake_case 字段）
      popularityData.value.set(id, {
        id,
        basePopularity: (attraction as any).base_popularity || (attraction as any).basePopularity || 0,
        viewCount: (attraction as any).view_count || (attraction as any).viewCount || 0,
        favoriteCount: (attraction as any).favorite_count || (attraction as any).favoriteCount || 0,
        commentCount: (attraction as any).comment_count || (attraction as any).commentCount || 0,
        calculatedPopularity: (attraction as any).calculated_popularity || (attraction as any).calculatedPopularity || 0
      })
    }
    return attraction
  } catch (error) {
    console.error('获取景点详情失败:', error)
    return null
  }
}

// 获取景点热度值
const getAttractionPopularity = (attractionId: string): number => {
  const data = popularityData.value.get(attractionId)
  return data ? data.calculatedPopularity : 0
}

// 增加热度值（用户行为）
const increasePopularity = async (attractionId: string, action: 'view' | 'favorite' | 'comment') => {
  try {
    switch (action) {
      case 'view':
        await ApiService.increaseViewCount(attractionId)
        break
      case 'favorite':
        await ApiService.increaseFavoriteCount(attractionId)
        break
      case 'comment':
        // 评论功能需要调用评论API
        break
    }
    
    // 重新加载景点数据以更新热度值
    await getAttractionById(attractionId)
    
    console.log(`热度值增加 - 景点ID: ${attractionId}, 行为: ${action}`)
  } catch (error) {
    console.error('增加热度值失败:', error)
  }
}

// 获取前N个热门景点
const getTopAttractions = async (limit: number = 5): Promise<Attraction[]> => {
  try {
    const topAttractions = await ApiService.getTopAttractions()
    return topAttractions.slice(0, limit)
  } catch (error) {
    console.error('获取热门景点失败:', error)
    return []
  }
}

// 按城市筛选景点
const getAttractionsByCity = async (city: string): Promise<Attraction[]> => {
  try {
    return await ApiService.getAttractionsByCity(city)
  } catch (error) {
    console.error('按城市筛选景点失败:', error)
    return []
  }
}

// 获取热度值日志
const getPopularityLogs = async (attractionId: string): Promise<PopularityLog[]> => {
  try {
    return await ApiService.getPopularityLogs(attractionId)
  } catch (error) {
    console.error('获取热度值日志失败:', error)
    return []
  }
}

// 管理员调整基础热度值
const adminAdjustPopularity = async (
  attractionId: string, 
  newPopularity: number, 
  reason: string = '手动调整'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await ApiService.adminAdjustPopularity(attractionId, newPopularity, reason)
    if (response.success) {
      // 重新加载景点数据以更新热度值
      await getAttractionById(attractionId)
      return { success: true }
    } else {
      return { success: false, error: response.message }
    }
  } catch (error: any) {
    return { success: false, error: error.message || '调整热度值失败' }
  }
}

// 获取所有景点
const getAllAttractions = (): Attraction[] => {
  return attractions.value
}

// 获取特定景点的热度数据
const getAttractionPopularityData = (attractionId: string): PopularityData | null => {
  return popularityData.value.get(attractionId) || null
}

// 导出组合式函数
const usePopularity = () => {
  return {
    // 数据加载
    loadAttractions,
    getAttractionById,
    loadPopularityData: loadAttractions, // 别名，用于Admin页面
    
    // 热度值操作
    getAttractionPopularity,
    increasePopularity,
    
    // 景点筛选
    getTopAttractions,
    getAttractionsByCity,
    getAllAttractions,
    
    // 日志管理
    getPopularityLogs,
    
    // 管理员功能
    adminAdjustPopularity,
    
    // 数据获取
    getAttractionPopularityData,
    getAllPopularityData: () => {
      // 转换为前端显示格式，并添加 currentPopularity 别名
      return Array.from(popularityData.value.values()).map(data => ({
        ...data,
        currentPopularity: data.calculatedPopularity // calculated_popularity 作为当前热度显示
      }))
    }
  }
}

export { usePopularity }