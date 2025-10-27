<template>
  <div v-if="attraction" class="min-h-screen bg-gray-50">
    <!-- 景点图片轮播 -->
    <div class="relative h-96 md:h-[500px] overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-30"></div>
      <img
        :src="currentImage"
        :alt="attraction.name"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ attraction.name }}</h1>
          <p class="text-xl md:text-2xl">{{ attraction.location }}</p>
        </div>
      </div>
      
      <!-- 图片切换按钮 -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(image, index) in attraction.images"
          :key="index"
          @click="currentImageIndex = index"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'"
        ></button>
      </div>
      
      <!-- 返回按钮 -->
      <button
        @click="goBack"
        class="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2">
          <!-- 基本信息 -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ attraction.name }}</h2>
                <div class="flex items-center space-x-4 text-gray-600">
                  <span class="flex items-center">
                    <svg class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    {{ attraction.location }}
                  </span>
                  <span class="flex items-center">
                    <svg class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    {{ attraction.rating }}⭐
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-blue-600 mb-2">
                  {{ attraction.price === 0 ? '免费' : `¥${attraction.price}` }}
                </div>
                <button
                  @click="handleFavoriteClick"
                  class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                  :class="isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  <svg class="h-5 w-5" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
                </button>
              </div>
            </div>
            
            <p class="text-gray-700 text-lg leading-relaxed mb-6">{{ attraction.description }}</p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in attraction.tags"
                :key="tag"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-4">详细信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">开放时间</h4>
                <p class="text-gray-600">{{ attraction.openingHours }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">推荐游览时间</h4>
                <p class="text-gray-600">{{ attraction.recommendedDuration }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">最佳游览季节</h4>
                <p class="text-gray-600">{{ attraction.bestTimeToVisit }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">联系电话</h4>
                <p class="text-gray-600">{{ attraction.phone }}</p>
              </div>
            </div>
          </div>

          <!-- 特色服务 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">特色服务</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="feature in attraction.features"
                :key="feature"
                class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
              >
                <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-700">{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 地图 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">位置信息</h3>
            <div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <div class="text-center text-gray-500">
                <svg class="h-12 w-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                <p>地图功能</p>
                <p class="text-sm">坐标: {{ attraction.coordinates.lat }}, {{ attraction.coordinates.lng }}</p>
              </div>
            </div>
          </div>

          <!-- 天气信息 -->
          <WeatherWidget />

          <!-- 相关景点 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">相关景点</h3>
            <div class="space-y-4">
              <div
                v-for="related in relatedAttractions"
                :key="related.id"
                @click="goToAttraction(related.id)"
                class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <img
                  :src="related.images[0]"
                  :alt="related.name"
                  class="w-12 h-12 object-cover rounded-lg"
                >
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ related.name }}</h4>
                  <p class="text-sm text-gray-600">{{ related.city }}</p>
                </div>
                <div class="text-sm text-blue-600">→</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 加载状态 -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { attractions } from '../data/attractions'
import type { Attraction } from '../types'
import { useAuth, initAuth } from '../composables/useAuth'
import WeatherWidget from '../components/WeatherWidget.vue'

const router = useRouter()
const route = useRoute()

// 使用认证系统
const { isLoggedIn, requireAuth } = useAuth()

// 响应式数据
const attraction = ref<Attraction | null>(null)
const currentImageIndex = ref(0)
const favorites = ref<string[]>([])

// 计算属性
const currentImage = computed(() => {
  return attraction.value?.images[currentImageIndex.value] || ''
})

const isFavorite = computed(() => {
  return attraction.value ? favorites.value.includes(attraction.value.id) : false
})

const relatedAttractions = computed(() => {
  if (!attraction.value) return []
  
  return attractions
    .filter(a => a.id !== attraction.value!.id && a.city === attraction.value!.city)
    .slice(0, 3)
})

// 方法
const goBack = () => {
  router.back()
}

const goToAttraction = (id: string) => {
  router.push(`/attractions/${id}`)
}

const toggleFavorite = () => {
  if (!attraction.value) return
  
  const index = favorites.value.indexOf(attraction.value.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(attraction.value.id)
  }
  
  // 保存到本地存储
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

// 处理收藏点击（需要登录权限）
const handleFavoriteClick = () => {
  requireAuth(() => {
    toggleFavorite()
  })
}

// 生命周期
onMounted(() => {
  // 初始化认证
  initAuth()
  
  // 从本地存储加载收藏
  const savedFavorites = localStorage.getItem('favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  // 根据路由参数加载景点数据
  const attractionId = route.params.id as string
  const foundAttraction = attractions.find(a => a.id === attractionId)
  
  if (foundAttraction) {
    attraction.value = foundAttraction
  } else {
    // 如果找不到景点，跳转到景点列表页
    router.push('/attractions')
  }
})
</script>
