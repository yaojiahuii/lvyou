<template>
  <div v-if="attraction" class="min-h-screen bg-gray-50">
    <!-- 景点图片轮播 -->
    <div class="relative h-96 md:h-[500px] overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-30"></div>
      <img
        :src="currentImage"
        :alt="attraction.name"
        class="w-full h-full object-cover"
        @error="onImageError"
      >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ attraction.name }}</h1>
          <p class="text-xl md:text-2xl">{{ attraction.city }} {{ attraction.location || '' }}</p>
        </div>
      </div>
      
      <!-- 图片切换按钮 -->
      <div v-if="attraction.images && attraction.images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
                  {{ attraction.price === 0 ? '免费' : `${attraction.price}元` }}
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
            
            <p class="text-gray-700 text-lg leading-relaxed mb-6">{{ attraction.description || '暂无描述' }}</p>
            
            <!-- 标签 -->
            <div v-if="attraction.tags && attraction.tags.length" class="flex flex-wrap gap-2 mb-6">
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
                <p class="text-gray-600">{{ attraction.opening_hours || '暂无' }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">推荐游览时间</h4>
                <p class="text-gray-600">{{ attraction.recommended_duration || '暂无' }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">最佳游览季节</h4>
                <p class="text-gray-600">{{ attraction.best_time_to_visit || '暂无' }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">联系电话</h4>
                <p class="text-gray-600">{{ attraction.contact_phone || '暂无' }}</p>
              </div>
            </div>
          </div>

          <!-- 特色服务 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">特色服务</h3>
            <div v-if="attraction.features && attraction.features.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <p v-else class="text-gray-500">暂无特色服务信息</p>
          </div>

          <!-- 用户评论 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">用户评论</h3>
              <div v-if="attractionComments.length > 0" class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">平均评分:</span>
                <span class="text-lg font-bold text-yellow-500">{{ commentStats.average }}</span>
                <span class="text-sm text-gray-500">({{ commentStats.total }}条评论)</span>
              </div>
            </div>

            <!-- 评论表单（需要登录） -->
            <div v-if="isLoggedIn" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">发表评论</h4>
              <form @submit.prevent="handleCommentSubmit">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">评分</label>
                  <div class="flex items-center space-x-1">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      @click="commentRating = star"
                      class="focus:outline-none transition-colors"
                      @mouseenter="hoverRating = star"
                      @mouseleave="hoverRating = 0"
                    >
                      <svg
                        class="w-8 h-8"
                        :class="star <= (hoverRating || commentRating) ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">评论内容</label>
                  <textarea
                    v-model="commentText"
                    rows="3"
                    placeholder="分享您的游览体验..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <div class="flex items-center space-x-4">
                  <button
                    type="submit"
                    :disabled="!commentRating || !commentText.trim() || isSubmittingComment"
                    class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ isSubmittingComment ? '提交中...' : '提交评论' }}
                  </button>
                  <button
                    type="button"
                    @click="resetCommentForm"
                    class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>

            <!-- 未登录提示 -->
            <div v-else class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-yellow-800">
                请
                <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">登录</router-link>
                后发表评论
              </p>
            </div>

            <!-- 评论列表 -->
            <div v-if="attractionComments.length > 0" class="space-y-4">
              <div
                v-for="comment in attractionComments"
                :key="comment.id"
                class="border-b border-gray-200 pb-4 last:border-0"
              >
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ comment.userName.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-2">
                        <span class="font-medium text-gray-900">{{ comment.userName }}</span>
                        <div class="flex items-center">
                          <svg
                            v-for="star in 5"
                            :key="star"
                            class="w-4 h-4"
                            :class="star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </div>
                      </div>
                      <span class="text-xs text-gray-500">{{ formatCommentDate(comment.createdAt) }}</span>
                    </div>
                    <p class="text-gray-700 text-sm">{{ comment.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 暂无评论 -->
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
              </svg>
              <p>暂无评论，成为第一个评论的人吧！</p>
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
                <p class="font-medium text-gray-700">{{ attraction.city }}{{ attraction.location ? ' · ' + attraction.location : '' }}</p>
                <p v-if="attraction.address" class="text-sm mt-1">{{ attraction.address }}</p>
              </div>
            </div>
          </div>

          <!-- 天气信息 -->
          <WeatherWidget />

          <!-- 相关景点 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">相关景点</h3>
            <div v-if="relatedAttractions.length > 0" class="space-y-4">
              <div
                v-for="related in relatedAttractions"
                :key="related.id"
                @click="goToAttraction(related.id)"
                class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <img
                  :src="related.images && related.images[0] ? related.images[0] : (related.image_url || 'https://via.placeholder.com/48x48?text=暂无')"
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
            <p v-else class="text-gray-500 text-sm text-center py-4">暂无同城市的相关景点</p>
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
import { ApiService } from '../services/api'
import type { Attraction } from '../types'
import { useAuth, initAuth } from '../composables/useAuth'
import { usePopularity } from '../composables/usePopularity'
import { useComments } from '../composables/useComments'
import WeatherWidget from '../components/WeatherWidget.vue'

const router = useRouter()
const route = useRoute()

// 使用热度管理和评论管理
const { increasePopularity, loadPopularityData } = usePopularity()
const { comments, getAttractionComments, addComment, getCommentStats, loadComments } = useComments()
const { isLoggedIn, requireAuth, currentUser } = useAuth()

// 响应式数据
const attraction = ref<Attraction | null>(null)
const allAttractions = ref<any[]>([])

// 评论相关数据
const commentRating = ref(0)
const hoverRating = ref(0)
const commentText = ref('')
const isSubmittingComment = ref(false)
const currentImageIndex = ref(0)
const favorites = ref<string[]>([])
const localComments = ref<any[]>([])

// 计算属性
const currentImage = computed(() => {
  if (attraction.value?.images && attraction.value.images.length > 0) {
    return attraction.value.images[currentImageIndex.value] || ''
  }
  return attraction.value?.image_url || 'https://via.placeholder.com/800x400?text=暂无图片'
})

const isFavorite = computed(() => {
  return attraction.value ? favorites.value.includes(String(attraction.value.id)) : false
})

// 评论相关计算属性
const attractionComments = computed(() => {
  if (!attraction.value) return []
  return getAttractionComments(String(attraction.value.id))
})

const commentStats = computed(() => {
  if (!attraction.value) {
    return { total: 0, average: 0 }
  }
  return getCommentStats(String(attraction.value.id))
})

const relatedAttractions = computed(() => {
  if (!attraction.value) return []
  return allAttractions.value
    .filter(a => String(a.id) !== String(attraction.value!.id) && a.city === attraction.value!.city)
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

  const strId = String(attraction.value.id)
  const index = favorites.value.indexOf(strId)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(strId)
  }
  
  // 保存到本地存储
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

// 图片加载失败处理
const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/800x400?text=图片加载失败'
}

// 处理收藏点击（需要登录权限）
const handleFavoriteClick = () => {
  requireAuth(() => {
    toggleFavorite()

    // 增加热度值
    if (attraction.value) {
      increasePopularity(String(attraction.value.id), 'favorite')
    }
  })
}

// 评论相关方法
const handleCommentSubmit = async () => {
  if (!attraction.value || !currentUser.value) return

  if (commentRating.value === 0 || !commentText.value.trim()) {
    alert('请选择评分并填写评论内容')
    return
  }

  isSubmittingComment.value = true

  try {
    // 添加评论（提交到后端）
    await addComment(
      attraction.value.id,
      currentUser.value.id,
      currentUser.value.name,
      commentRating.value,
      commentText.value.trim()
    )

    // 增加热度值
    increasePopularity(String(attraction.value.id), 'comment')

    // 重置表单
    resetCommentForm()

    alert('评论提交成功！感谢您的反馈')
  } catch (error) {
    alert('评论提交失败，请稍后重试')
    console.error('评论提交错误:', error)
  } finally {
    isSubmittingComment.value = false
  }
}

const resetCommentForm = () => {
  commentRating.value = 0
  hoverRating.value = 0
  commentText.value = ''
}

const formatCommentDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' })
}

// 生命周期
onMounted(async () => {
  // 初始化认证
  initAuth()

  // 初始化热度数据和评论数据，同时获取所有景点用于"相关景点"
  allAttractions.value = await loadPopularityData()

  // 从本地存储加载评论
  const savedComments = localStorage.getItem('attractionComments')
  if (savedComments) {
    localComments.value = JSON.parse(savedComments)
  }

  // 从本地存储加载收藏
  const savedFavorites = localStorage.getItem('favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }

  // 根据路由参数从API加载景点数据
  const attractionId = route.params.id as string

  try {
    const data = await ApiService.getAttractionById(attractionId)
    if (data) {
      attraction.value = data
      // 跳转到页面顶部
      window.scrollTo(0, 0)
      // 增加浏览热度
      increasePopularity(attractionId, 'view')
      // 从后端加载该景点的评论
      loadComments(attractionId)
    } else {
      alert('未找到该景点')
      router.push('/attractions')
    }
  } catch (error) {
    console.error('加载景点详情失败:', error)
    alert('加载景点详情失败')
    router.push('/attractions')
  }
})
</script>
