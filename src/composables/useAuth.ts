import { ref, computed } from 'vue'

// 全局用户状态
const currentUser = ref(null)

// 检查是否已登录
const isLoggedIn = computed(() => {
  return currentUser.value !== null
})

// 检查用户登录状态
export const checkUserStatus = () => {
  const userSession = sessionStorage.getItem('currentUser')
  if (userSession) {
    currentUser.value = JSON.parse(userSession)
  } else {
    // 检查是否有记住的用户
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      currentUser.value = JSON.parse(rememberedUser)
      // 自动登录
      sessionStorage.setItem('currentUser', rememberedUser)
    }
  }
}

// 登录
export const login = (userData: any) => {
  currentUser.value = userData
  sessionStorage.setItem('currentUser', JSON.stringify(userData))
}

// 登出
export const logout = () => {
  currentUser.value = null
  sessionStorage.removeItem('currentUser')
  localStorage.removeItem('rememberedUser')
}

// 检查是否需要登录
export const requireAuth = (callback: () => void) => {
  if (isLoggedIn.value) {
    callback()
  } else {
    // 显示登录提示
    showLoginPrompt()
  }
}

// 显示登录提示
export const showLoginPrompt = () => {
  const confirmed = confirm('此操作需要登录，是否前往登录页面？')
  if (confirmed) {
    // 跳转到登录页面
    window.location.href = '/login'
  }
}

// 获取当前用户
export const getCurrentUser = () => {
  return currentUser.value
}

// 初始化认证状态
export const initAuth = () => {
  checkUserStatus()
  
  // 监听存储变化（用于跨标签页同步）
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser' || e.key === 'rememberedUser') {
      checkUserStatus()
    }
  })
}

// 导出认证状态
export const useAuth = () => {
  return {
    currentUser,
    isLoggedIn,
    login,
    logout,
    requireAuth,
    showLoginPrompt,
    getCurrentUser
  }
}
