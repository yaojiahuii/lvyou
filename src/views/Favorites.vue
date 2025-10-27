<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 未登录提示 -->
    <div v-if="!isLoggedIn" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="mb-8">
          <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">需要登录</h2>
          <p class="text-gray-600 mb-8">请先登录以查看您的收藏内容</p>
        </div>
        
        <div class="space-y-4">
          <router-link
            to="/login"
            class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
          >
            立即登录
          </router-link>
          <router-link
            to="/register"
            class="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-block"
          >
            注册账户
          </router-link>
        </div>
        
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-2">演示账户</h3>
          <div class="text-xs text-blue-700 space-y-1">
            <p><strong>邮箱:</strong> demo@example.com</p>
            <p><strong>密码:</strong> demo123</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 已登录内容 -->
    <div v-else>
      <!-- 页面头部 -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">我的收藏</h1>
            <p class="text-lg text-gray-600">您收藏的景点和路线</p>
          </div>
        </div>
      </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 标签页 -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'attractions'"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'attractions' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              收藏景点 ({{ favoriteAttractions.length }})
            </button>
            <button
              @click="activeTab = 'routes'"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'routes' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              收藏路线 ({{ favoriteRoutes.length }})
            </button>
          </nav>
        </div>
      </div>

      <!-- 收藏景点 -->
      <div v-if="activeTab === 'attractions'">
        <div v-if="favoriteAttractions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="attraction in favoriteAttractions"
            :key="attraction.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="relative">
              <img
                :src="attraction.images[0]"
                :alt="attraction.name"
                class="w-full h-48 object-cover"
              >
              <div class="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm font-semibold">
                {{ attraction.rating }}⭐
              </div>
              <button
                @click="removeFavoriteAttraction(attraction.id)"
                class="absolute top-4 left-4 bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full transition-colors"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ attraction.name }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ attraction.description }}</p>
              
              <div class="flex items-center justify-between mb-4">
                <span class="text-blue-600 font-semibold text-lg">
                  {{ attraction.price === 0 ? '免费' : `¥${attraction.price}` }}
                </span>
                <span class="text-sm text-gray-500">{{ attraction.city }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ attraction.recommendedDuration }}</span>
                <button
                  @click="goToAttraction(attraction.id)"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-500 text-lg mb-4">还没有收藏任何景点</div>
          <router-link
            to="/attractions"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            去浏览景点
          </router-link>
        </div>
      </div>

      <!-- 收藏路线 -->
      <div v-if="activeTab === 'routes'">
        <div v-if="favoriteRoutes.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            v-for="route in favoriteRoutes"
            :key="route.id"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ route.name }}</h3>
              <button
                @click="removeFavoriteRoute(route.id)"
                class="text-red-500 hover:text-red-700 p-1 transition-colors"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <p class="text-gray-600 mb-4">{{ route.description }}</p>
            
            <div class="flex items-center space-x-6 mb-4 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                </svg>
                {{ route.duration }}
              </span>
              <span v-if="route.distance > 0" class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                {{ route.distance }}km
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in route.tags.slice(0, 3)"
                  :key="tag"
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {{ tag }}
                </span>
              </div>
              <button
                @click="goToRoute(route.id)"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-500 text-lg mb-4">还没有收藏任何路线</div>
          <router-link
            to="/routes"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            去浏览路线
          </router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { attractions, routes } from '../data/attractions'
import { useAuth, initAuth } from '../composables/useAuth'
import type { Attraction, Route } from '../types'

const router = useRouter()

// 使用认证系统
const { isLoggedIn } = useAuth()

// 响应式数据
const activeTab = ref<'attractions' | 'routes'>('attractions')
const favoriteAttractionIds = ref<string[]>([])
const favoriteRouteIds = ref<string[]>([])

// 计算属性
const favoriteAttractions = computed(() => {
  return attractions.filter(attraction => favoriteAttractionIds.value.includes(attraction.id))
})

const favoriteRoutes = computed(() => {
  return routes.filter(route => favoriteRouteIds.value.includes(route.id))
})

// 方法
const removeFavoriteAttraction = (id: string) => {
  const index = favoriteAttractionIds.value.indexOf(id)
  if (index > -1) {
    favoriteAttractionIds.value.splice(index, 1)
    localStorage.setItem('favorites', JSON.stringify(favoriteAttractionIds.value))
  }
}

const removeFavoriteRoute = (id: string) => {
  const index = favoriteRouteIds.value.indexOf(id)
  if (index > -1) {
    favoriteRouteIds.value.splice(index, 1)
    localStorage.setItem('routeFavorites', JSON.stringify(favoriteRouteIds.value))
  }
}

const goToAttraction = (id: string) => {
  router.push(`/attractions/${id}`)
}

const goToRoute = (id: string) => {
  router.push(`/routes/${id}`)
}

// 生命周期
onMounted(() => {
  // 初始化认证
  initAuth()
  
  // 从本地存储加载收藏
  const savedAttractionFavorites = localStorage.getItem('favorites')
  if (savedAttractionFavorites) {
    favoriteAttractionIds.value = JSON.parse(savedAttractionFavorites)
  }
  
  const savedRouteFavorites = localStorage.getItem('routeFavorites')
  if (savedRouteFavorites) {
    favoriteRouteIds.value = JSON.parse(savedRouteFavorites)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
