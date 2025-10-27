<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">推荐路线</h1>
          <p class="text-lg text-gray-600">精心设计的旅游路线，让您的湖北之旅更加精彩</p>
        </div>
      </div>
    </div>

    <!-- 路线列表 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="route in routes"
          :key="route.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ route.name }}</h3>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-green-100 text-green-800': route.difficulty === 'easy',
                  'bg-yellow-100 text-yellow-800': route.difficulty === 'medium',
                  'bg-red-100 text-red-800': route.difficulty === 'hard'
                }"
              >
                {{ route.difficulty === 'easy' ? '简单' : route.difficulty === 'medium' ? '中等' : '困难' }}
              </span>
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
            
            <!-- 包含景点 -->
            <div class="mb-4">
              <h4 class="font-semibold text-gray-900 mb-2">包含景点</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="attractionId in route.attractions"
                  :key="attractionId"
                  class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {{ getAttractionName(attractionId) }}
                </span>
              </div>
            </div>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in route.tags"
                :key="tag"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <button
                @click="viewRouteDetail(route.id)"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                查看详情
              </button>
              <button
                @click="toggleFavorite(route.id)"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                :class="isFavorite(route.id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <svg class="h-4 w-4" :fill="isFavorite(route.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="text-sm">{{ isFavorite(route.id) ? '已收藏' : '收藏' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { routes, attractions } from '../data/attractions'

const router = useRouter()
const favorites = ref<string[]>([])

// 方法
const getAttractionName = (id: string) => {
  const attraction = attractions.find(a => a.id === id)
  return attraction ? attraction.name : '未知景点'
}

const viewRouteDetail = (id: string) => {
  router.push(`/routes/${id}`)
}

const toggleFavorite = (id: string) => {
  const index = favorites.value.indexOf(id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(id)
  }
  
  // 保存到本地存储
  localStorage.setItem('routeFavorites', JSON.stringify(favorites.value))
}

const isFavorite = (id: string) => {
  return favorites.value.includes(id)
}

// 生命周期
onMounted(() => {
  // 从本地存储加载收藏
  const savedFavorites = localStorage.getItem('routeFavorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
})
</script>
