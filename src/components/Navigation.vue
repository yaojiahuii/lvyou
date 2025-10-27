<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">湖</span>
            </div>
            <span class="text-xl font-bold text-gray-800">湖北智能旅游</span>
          </router-link>
        </div>

        <!-- 导航菜单 -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'text-blue-600': $route.path === '/' }"
          >
            首页
          </router-link>
          <router-link 
            to="/attractions" 
            class="nav-link"
            :class="{ 'text-blue-600': $route.path === '/attractions' }"
          >
            景点
          </router-link>
          <router-link 
            to="/routes" 
            class="nav-link"
            :class="{ 'text-blue-600': $route.path === '/routes' }"
          >
            路线
          </router-link>
          <router-link 
            to="/favorites" 
            class="nav-link"
            :class="{ 'text-blue-600': $route.path === '/favorites' }"
          >
            收藏
          </router-link>
        </div>

        <!-- 用户菜单 -->
        <div class="hidden md:flex items-center space-x-4">
          <div v-if="isLoggedIn" class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">欢迎，{{ currentUser?.name }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              登出
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <router-link
              to="/login"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              登录
            </router-link>
            <router-link
              to="/register"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              注册
            </router-link>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="hidden lg:flex items-center">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索景点..."
              class="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          <router-link 
            to="/" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
            @click="closeMobileMenu"
          >
            首页
          </router-link>
          <router-link 
            to="/attractions" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
            @click="closeMobileMenu"
          >
            景点
          </router-link>
          <router-link 
            to="/routes" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
            @click="closeMobileMenu"
          >
            路线
          </router-link>
          <router-link 
            to="/favorites" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
            @click="closeMobileMenu"
          >
            收藏
          </router-link>
          
          <!-- 移动端用户菜单 -->
          <div v-if="isLoggedIn" class="px-3 py-2 border-t border-gray-200">
            <div class="text-sm text-gray-700 mb-2">欢迎，{{ currentUser?.name }}</div>
            <button
              @click="handleLogout"
              class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              登出
            </button>
          </div>
          <div v-else class="px-3 py-2 border-t border-gray-200 space-y-2">
            <router-link
              to="/login"
              class="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
              @click="closeMobileMenu"
            >
              登录
            </router-link>
            <router-link
              to="/register"
              class="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm text-center"
              @click="closeMobileMenu"
            >
              注册
            </router-link>
          </div>
          
          <div class="px-3 py-2">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索景点..."
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, initAuth } from '../composables/useAuth'

const router = useRouter()
const searchQuery = ref('')
const mobileMenuOpen = ref(false)

// 使用认证系统
const { currentUser, isLoggedIn, logout } = useAuth()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/attractions',
      query: { search: searchQuery.value }
    })
    closeMobileMenu()
  }
}

// 处理登出
const handleLogout = () => {
  logout()
  closeMobileMenu()
  router.push('/')
}

// 组件挂载时初始化认证
onMounted(() => {
  initAuth()
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200;
}
</style>
