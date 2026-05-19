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
              收藏路线 ({{ favoriteRoutes.length + favoriteCustomRoutes.length }})
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
                :src="getFirstImage(attraction)"
                :alt="attraction.name"
                class="w-full h-48 object-cover"
                @error="onImageError"
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
                  {{ attraction.price === 0 ? '免费' : `${attraction.price}元` }}
                </span>
                <span class="text-sm text-gray-500">{{ attraction.city }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ attraction.recommended_duration || attraction.recommendedDuration || '' }}</span>
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
        <!-- 推荐路线收藏 -->
        <div v-if="favoriteRoutes.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            推荐路线
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="route in favoriteRoutes"
              :key="route.id"
              class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="text-xl font-bold text-gray-900">{{ route.name }}</h4>
                  <span
                    class="inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': route.difficulty === 'easy',
                      'bg-yellow-100 text-yellow-800': route.difficulty === 'medium',
                      'bg-red-100 text-red-800': route.difficulty === 'hard'
                    }"
                  >
                    {{ route.difficulty === 'easy' ? '简单' : route.difficulty === 'medium' ? '中等' : '困难' }}
                  </span>
                </div>
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
        </div>

        <!-- 自定义行程收藏 -->
        <div v-if="favoriteCustomRoutes.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            我的行程
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="route in favoriteCustomRoutes"
              :key="route.id"
              class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="text-xl font-bold text-gray-900">{{ route.name }}</h4>
                  <p class="text-gray-500 text-sm mt-1">{{ route.days }}天行程 · {{ route.attractions?.length || 0 }}个景点</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': route.difficulty === 'easy',
                      'bg-yellow-100 text-yellow-800': route.difficulty === 'medium',
                      'bg-red-100 text-red-800': route.difficulty === 'hard'
                    }"
                  >
                    {{ route.difficulty === 'easy' ? '简单' : route.difficulty === 'medium' ? '中等' : '困难' }}
                  </span>
                  <button
                    @click="removeFavoriteCustomRoute(route.id)"
                    class="text-red-500 hover:text-red-700 p-1 transition-colors"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 每日行程预览 -->
              <div class="space-y-2 mb-4">
                <div
                  v-for="(day, index) in (route.dailyPlan || []).slice(0, 2)"
                  :key="index"
                  class="bg-gray-50 rounded-lg p-3"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-900 text-sm">第{{ index + 1 }}天</span>
                    <span class="text-xs text-gray-500">{{ day.date || '未设置' }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="attrId in (day.attractions || []).slice(0, 3)"
                      :key="attrId"
                      class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs"
                    >
                      {{ getAttractionName(attrId) }}
                    </span>
                    <span v-if="!day.attractions || day.attractions.length === 0" class="text-gray-400 text-xs">暂无安排</span>
                  </div>
                </div>
                <p v-if="(route.dailyPlan || []).length > 2" class="text-sm text-gray-500 text-center">
                  还有 {{ route.dailyPlan.length - 2 }} 天行程...
                </p>
              </div>
              
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in (route.tags || []).slice(0, 3)"
                    :key="tag"
                    class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
                <button
                  @click="goToRoutes"
                  class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  查看行程
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="favoriteRoutes.length === 0 && favoriteCustomRoutes.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg mb-4">还没有收藏任何路线</div>
          <div class="flex justify-center space-x-4">
            <router-link
              to="/routes"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              浏览推荐路线
            </router-link>
            <router-link
              to="/routes"
              class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              创建我的行程
            </router-link>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { routes } from '../data/attractions'
import { useAuth, initAuth } from '../composables/useAuth'
import { usePopularity } from '../composables/usePopularity'

const router = useRouter()

// 使用认证系统
const { isLoggedIn } = useAuth()
const { loadAttractions } = usePopularity()

// 响应式数据
const activeTab = ref<'attractions' | 'routes'>('attractions')
const allAttractions = ref<any[]>([])
const favoriteAttractionIds = ref<string[]>([])
const favoriteRouteIds = ref<string[]>([])
const favoriteCustomRouteIds = ref<string[]>([])
const customRoutes = ref<any[]>([])

// 计算属性
const favoriteAttractions = computed(() => {
  return allAttractions.value.filter(attraction => favoriteAttractionIds.value.includes(String(attraction.id)))
})

const favoriteRoutes = computed(() => {
  return routes.filter(route => favoriteRouteIds.value.includes(route.id))
})

const favoriteCustomRoutes = computed(() => {
  return customRoutes.value.filter(route => favoriteCustomRouteIds.value.includes(route.id))
})

// 获取景点名称
const getAttractionName = (id: string) => {
  const attraction = allAttractions.value.find(a => String(a.id) === id)
  return attraction ? attraction.name : '未知景点'
}

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

const removeFavoriteCustomRoute = (id: string) => {
  const index = favoriteCustomRouteIds.value.indexOf(id)
  if (index > -1) {
    favoriteCustomRouteIds.value.splice(index, 1)
    localStorage.setItem('customRouteFavorites', JSON.stringify(favoriteCustomRouteIds.value))
  }
}

const goToAttraction = (id: string) => {
  router.push(`/attractions/${id}`)
}

const goToRoute = (id: string) => {
  router.push(`/routes/${id}`)
}

const goToRoutes = () => {
  router.push('/routes')
}

// 获取景点第一张图片
const getFirstImage = (attraction: any) => {
  if (attraction.images && attraction.images.length > 0) {
    return attraction.images[0]
  }
  if (attraction.image_url) {
    return attraction.image_url
  }
  return 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(attraction.name || '暂无图片')
}

// 图片加载失败处理
const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300?text=图片加载失败'
}

// 生命周期
onMounted(async () => {
  // 初始化认证
  initAuth()

  // 从API加载所有景点数据
  allAttractions.value = await loadAttractions()

  // 从本地存储加载收藏
  const savedAttractionFavorites = localStorage.getItem('favorites')
  if (savedAttractionFavorites) {
    favoriteAttractionIds.value = JSON.parse(savedAttractionFavorites)
  }
  
  const savedRouteFavorites = localStorage.getItem('routeFavorites')
  if (savedRouteFavorites) {
    favoriteRouteIds.value = JSON.parse(savedRouteFavorites)
  }

  const savedCustomRouteFavorites = localStorage.getItem('customRouteFavorites')
  if (savedCustomRouteFavorites) {
    favoriteCustomRouteIds.value = JSON.parse(savedCustomRouteFavorites)
  }

  // 加载自定义路线
  const savedCustomRoutes = localStorage.getItem('customRoutes')
  if (savedCustomRoutes) {
    customRoutes.value = JSON.parse(savedCustomRoutes)
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
