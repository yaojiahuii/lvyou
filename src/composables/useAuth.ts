import { ref, computed } from 'vue'
import type { User } from '../types'
import { ApiService } from '../services/api'

// 全局用户状态
const currentUser = ref<User | null>(null)

// 检查是否已登录
const isLoggedIn = computed(() => {
  return currentUser.value !== null
})

// 检查是否是管理员
const isAdmin = computed(() => {
  return currentUser.value?.role === 'admin'
})

// 密码强度检查
const checkPasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位' }
  }
  return { valid: true, message: '密码设置成功' }
}

// 检查用户登录状态
export const checkUserStatus = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const response = await ApiService.getCurrentUser()
      if (response.success) {
        currentUser.value = response.data
        sessionStorage.setItem('currentUser', JSON.stringify(response.data))
      }
    } catch (error) {
      // Token 无效，清除本地存储
      localStorage.removeItem('token')
      sessionStorage.removeItem('currentUser')
    }
  }
}

// 注册
export const register = async (userData: {
  email: string
  password: string
  name: string
  role?: string
}): Promise<{ user: User | null; error?: string }> => {
  try {
    // 检查密码强度
    const passwordCheck = checkPasswordStrength(userData.password)
    if (!passwordCheck.valid) {
      return { user: null, error: passwordCheck.message }
    }

    const response = await ApiService.register(userData)
    if (response.success) {
      return { user: response.data }
    } else {
      return { user: null, error: response.message }
    }
  } catch (error: any) {
    return { user: null, error: error.message || '注册失败' }
  }
}

// 登录
export const login = async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
  try {
    const response = await ApiService.login({ email, password })
    if (response.success && response.data) {
      currentUser.value = response.data.user
      sessionStorage.setItem('currentUser', JSON.stringify(response.data.user))
      return { user: response.data.user }
    } else {
      return { user: null, error: response.message || '登录失败' }
    }
  } catch (error: any) {
    return { user: null, error: error.message || '登录失败' }
  }
}

// 快速登录（用于注册后自动登录）
export const quickLogin = (userData: any) => {
  currentUser.value = userData
  sessionStorage.setItem('currentUser', JSON.stringify(userData))
}

// 登出
export const logout = () => {
  currentUser.value = null
  localStorage.removeItem('token')
  sessionStorage.removeItem('currentUser')
  localStorage.removeItem('rememberedUser')
}

// 检查是否需要登录
export const requireAuth = (callback: () => void) => {
  if (isLoggedIn.value) {
    callback()
  } else {
    showLoginPrompt()
  }
}

// 显示登录提示
export const showLoginPrompt = () => {
  const confirmed = confirm('此操作需要登录，是否前往登录页面？')
  if (confirmed) {
    window.location.href = '/login'
  }
}

// 获取当前用户
export const getCurrentUser = () => {
  return currentUser.value
}

// 检查管理员权限
export const requireAdmin = (callback: () => void) => {
  if (isAdmin.value) {
    callback()
  } else {
    alert('此操作需要管理员权限')
  }
}

// 初始化认证状态
export const initAuth = () => {
  checkUserStatus()
  
  // 监听存储变化（用于跨标签页同步）
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser' || e.key === 'token') {
      checkUserStatus()
    }
  })
}

// 密码重置
export const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // 检查新密码强度
    const passwordCheck = checkPasswordStrength(newPassword)
    if (!passwordCheck.valid) {
      return { success: false, error: passwordCheck.message }
    }

    const response = await ApiService.resetPassword(email, newPassword)
    return { success: response.success }
  } catch (error: any) {
    return { success: false, error: error.message || '密码重置失败' }
  }
}

// 修改密码
export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // 检查新密码强度
    const passwordCheck = checkPasswordStrength(newPassword)
    if (!passwordCheck.valid) {
      return { success: false, error: passwordCheck.message }
    }

    const response = await ApiService.changePassword(oldPassword, newPassword)
    return { success: response.success }
  } catch (error: any) {
    return { success: false, error: error.message || '密码修改失败' }
  }
}

// 检查邮箱是否存在
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    const response = await ApiService.checkEmail(email)
    return { exists: response.data.exists }
  } catch (error: any) {
    return { exists: false, error: error.message || '邮箱检查失败' }
  }
}

// 更新用户偏好（需要后端支持时实现）
export const updateUserPreferences = async (preferences: any): Promise<{ success: boolean; error?: string }> => {
  // 暂时返回成功，后续实现后端接口
  return { success: true }
}

// 添加用户历史记录（需要后端支持时实现）
export const addConsultationRecord = async (record: any): Promise<{ success: boolean; error?: string }> => {
  // 暂时返回成功，后续实现后端接口
  return { success: true }
}

// 导出认证状态
export const useAuth = () => {
  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    register,
    login,
    quickLogin,
    logout,
    requireAuth,
    requireAdmin,
    showLoginPrompt,
    getCurrentUser,
    resetPassword,
    changePassword,
    checkEmailExists,
    updateUserPreferences,
    addConsultationRecord
  }
}