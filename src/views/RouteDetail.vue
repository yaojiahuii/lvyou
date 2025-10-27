<template>
  <div v-if="currentRoute" class="min-h-screen bg-gray-50">
    <!-- 路线头部 -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ currentRoute.name }}</h1>
            <p class="text-lg opacity-90">{{ currentRoute.description }}</p>
          </div>
          <button
            @click="goBack"
            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>
        
        <div class="mt-6 flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ currentRoute.duration }}</span>
          </div>
          <div v-if="currentRoute.distance > 0" class="flex items-center space-x-2">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ currentRoute.distance }}km</span>
          </div>
          <div class="flex items-center space-x-2">
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="{
                'bg-green-100 text-green-800': currentRoute.difficulty === 'easy',
                'bg-yellow-100 text-yellow-800': currentRoute.difficulty === 'medium',
                'bg-red-100 text-red-800': currentRoute.difficulty === 'hard'
              }"
            >
              {{ currentRoute.difficulty === 'easy' ? '简单' : currentRoute.difficulty === 'medium' ? '中等' : '困难' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2">
          <!-- 路线景点 -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">路线景点</h2>
            <div class="space-y-6">
              <div
                v-for="(attraction, index) in routeAttractions"
                :key="attraction.id"
                class="flex items-start space-x-4"
              >
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-start space-x-4">
                    <img
                      :src="attraction.images[0]"
                      :alt="attraction.name"
                      class="w-20 h-20 object-cover rounded-lg"
                    >
                    <div class="flex-1">
                      <h3 class="text-lg font-bold text-gray-900 mb-1">{{ attraction.name }}</h3>
                      <p class="text-gray-600 mb-2">{{ attraction.description }}</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>⭐ {{ attraction.rating }}</span>
                        <span>{{ attraction.city }}</span>
                        <span>{{ attraction.recommendedDuration }}</span>
                      </div>
                    </div>
                    <button
                      @click="goToAttraction(attraction.id)"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 路线建议 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">路线建议</h2>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h3 class="font-semibold text-gray-900">最佳游览时间</h3>
                  <p class="text-gray-600">建议在早上8点开始游览，避开人流高峰</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h3 class="font-semibold text-gray-900">交通建议</h3>
                  <p class="text-gray-600">建议使用公共交通或租车，注意停车位情况</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 class="font-semibold text-gray-900">餐饮建议</h3>
                  <p class="text-gray-600">沿途有多个餐厅选择，建议提前预订</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h3 class="font-semibold text-gray-900">注意事项</h3>
                  <p class="text-gray-600">请遵守景区规定，保护环境，注意安全</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 路线信息 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">路线信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">难度等级</span>
                <span class="font-semibold">
                  {{ currentRoute.difficulty === 'easy' ? '简单' : currentRoute.difficulty === 'medium' ? '中等' : '困难' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">预计时间</span>
                <span class="font-semibold">{{ currentRoute.duration }}</span>
              </div>
              <div v-if="currentRoute.distance > 0" class="flex justify-between">
                <span class="text-gray-600">总距离</span>
                <span class="font-semibold">{{ currentRoute.distance }}km</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">景点数量</span>
                <span class="font-semibold">{{ currentRoute.attractions.length }}个</span>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">路线标签</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in currentRoute.tags"
                :key="tag"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 收藏按钮 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <button
              @click="toggleFavorite"
              class="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium"
              :class="isFavorite ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'"
            >
              <svg class="h-5 w-5" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>{{ isFavorite ? '已收藏' : '收藏路线' }}</span>
            </button>
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
import { routes, attractions } from '../data/attractions'
import type { Route, Attraction } from '../types'

const router = useRouter()
const route = useRoute()

// 响应式数据
const routeData = ref<Route | null>(null)
const favorites = ref<string[]>([])

// 计算属性
const currentRoute = computed(() => routeData.value)
const routeAttractions = computed(() => {
  if (!currentRoute.value) return []
  
  return currentRoute.value.attractions
    .map(id => attractions.find(a => a.id === id))
    .filter((a): a is Attraction => a !== undefined)
})

const isFavorite = computed(() => {
  return currentRoute.value ? favorites.value.includes(currentRoute.value.id) : false
})

// 方法
const goBack = () => {
  router.back()
}

const goToAttraction = (id: string) => {
  router.push(`/attractions/${id}`)
}

const toggleFavorite = () => {
  if (!currentRoute.value) return
  
  const index = favorites.value.indexOf(currentRoute.value.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(currentRoute.value.id)
  }
  
  // 保存到本地存储
  localStorage.setItem('routeFavorites', JSON.stringify(favorites.value))
}

// 生命周期
onMounted(() => {
  // 从本地存储加载收藏
  const savedFavorites = localStorage.getItem('routeFavorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  // 根据路由参数加载路线数据
  const routeId = route.params.id as string
  const foundRoute = routes.find(r => r.id === routeId)
  
  if (foundRoute) {
    routeData.value = foundRoute
  } else {
    // 如果找不到路线，跳转到路线列表页
    router.push('/routes')
  }
})
</script>
