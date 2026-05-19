import { ref } from 'vue'
import { ApiService } from '../services/api'

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
  avatar?: string
  status: string
  created_at: string
  updated_at: string
}

export interface SystemStatistics {
  totalUsers: number
  totalAdmins: number
  totalAttractions: number
  totalRoutes: number
}

const users = ref<AdminUser[]>([])
const statistics = ref<SystemStatistics | null>(null)

// 加载所有用户
const loadUsers = async () => {
  try {
    users.value = await ApiService.getAllUsers()
    return users.value
  } catch (error) {
    console.error('加载用户数据失败:', error)
    return []
  }
}

// 更新用户角色
const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await ApiService.updateUserRole(userId, role)
    if (response.success) {
      await loadUsers() // 重新加载用户列表
      return { success: true }
    }
    return { success: false, error: response.message }
  } catch (error: any) {
    return { success: false, error: error.message || '更新失败' }
  }
}

// 更新用户状态
const updateUserStatus = async (userId: string, status: string) => {
  try {
    const response = await ApiService.updateUserStatus(userId, status)
    if (response.success) {
      await loadUsers() // 重新加载用户列表
      return { success: true }
    }
    return { success: false, error: response.message }
  } catch (error: any) {
    return { success: false, error: error.message || '更新失败' }
  }
}

// 删除用户
const deleteUser = async (userId: string) => {
  try {
    const response = await ApiService.deleteUser(userId)
    if (response.success) {
      await loadUsers() // 重新加载用户列表
      return { success: true }
    }
    return { success: false, error: response.message }
  } catch (error: any) {
    return { success: false, error: error.message || '删除失败' }
  }
}

// 加载系统统计
const loadStatistics = async () => {
  try {
    statistics.value = await ApiService.getSystemStatistics()
    return statistics.value
  } catch (error) {
    console.error('加载统计数据失败:', error)
    return null
  }
}

export const useAdmin = () => {
  return {
    users,
    statistics,
    loadUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    loadStatistics
  }
}
