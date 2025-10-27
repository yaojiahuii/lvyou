<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">湖北景点</h1>
            <p class="text-lg text-gray-600">探索湖北的美丽风景和丰富文化</p>
          </div>
          
          <!-- 搜索和筛选 -->
          <div class="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="搜索景点..."
                class="w-full sm:w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <select
              v-model="selectedCity"
              @change="handleFilter"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有城市</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
            
            <select
              v-model="selectedPriceRange"
              @change="handleFilter"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有价格</option>
              <option value="free">免费</option>
              <option value="0-100">0-100元</option>
              <option value="100-200">100-200元</option>
              <option value="200+">200元以上</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 景点列表 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="attraction in filteredAttractions"
          :key="attraction.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          @click="goToDetail(attraction.id)"
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
            <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {{ attraction.city }}
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ attraction.name }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ attraction.description }}</p>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-blue-600 font-semibold text-lg">
                {{ attraction.price === 0 ? '免费' : `¥${attraction.price}` }}
              </span>
              <span class="text-sm text-gray-500">{{ attraction.recommendedDuration }}</span>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in attraction.tags.slice(0, 3)"
                :key="tag"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="toggleFavorite(attraction.id)"
                  class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  :class="{ 'text-red-500': isFavorite(attraction.id) }"
                >
                  <svg class="h-5 w-5" :fill="isFavorite(attraction.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
                <span class="text-sm text-gray-500">{{ attraction.openingHours }}</span>
              </div>
              <button
                @click.stop="goToDetail(attraction.id)"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无结果提示 -->
      <div v-if="filteredAttractions.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-lg mb-4">没有找到符合条件的景点</div>
        <button
          @click="clearFilters"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          清除筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { attractions } from '../data/attractions'
import type { Attraction } from '../types'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedCity = ref('')
const selectedPriceRange = ref('')
const favorites = ref<string[]>([])

// 计算属性
const cities = computed(() => {
  const citySet = new Set(attractions.map(a => a.city))
  return Array.from(citySet).sort()
})

const filteredAttractions = computed(() => {
  let filtered = attractions

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(attraction =>
      attraction.name.toLowerCase().includes(query) ||
      attraction.description.toLowerCase().includes(query) ||
      attraction.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 城市过滤
  if (selectedCity.value) {
    filtered = filtered.filter(attraction => attraction.city === selectedCity.value)
  }

  // 价格过滤
  if (selectedPriceRange.value) {
    filtered = filtered.filter(attraction => {
      switch (selectedPriceRange.value) {
        case 'free':
          return attraction.price === 0
        case '0-100':
          return attraction.price > 0 && attraction.price <= 100
        case '100-200':
          return attraction.price > 100 && attraction.price <= 200
        case '200+':
          return attraction.price > 200
        default:
          return true
      }
    })
  }

  return filtered
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const handleFilter = () => {
  // 筛选逻辑已在计算属性中处理
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCity.value = ''
  selectedPriceRange.value = ''
}

const goToDetail = (id: string) => {
  router.push(`/attractions/${id}`)
}

const toggleFavorite = (id: string) => {
  const index = favorites.value.indexOf(id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(id)
  }
  // 保存到本地存储
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

const isFavorite = (id: string) => {
  return favorites.value.includes(id)
}

// 生命周期
onMounted(() => {
  // 从本地存储加载收藏
  const savedFavorites = localStorage.getItem('favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  // 处理URL查询参数
  const urlParams = new URLSearchParams(window.location.search)
  const searchParam = urlParams.get('search')
  if (searchParam) {
    searchQuery.value = searchParam
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
