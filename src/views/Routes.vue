<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">旅游路线</h1>
            <p class="text-gray-600">精心设计的旅游路线，让您的湖北之旅更加精彩</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>创建行程</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex space-x-4 border-b border-gray-200">
        <button
          @click="activeTab = 'recommend'"
          class="px-4 py-2 font-medium transition-colors border-b-2"
          :class="activeTab === 'recommend' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'"
        >
          推荐路线
        </button>
        <button
          @click="activeTab = 'custom'"
          class="px-4 py-2 font-medium transition-colors border-b-2"
          :class="activeTab === 'custom' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'"
        >
          我的行程 ({{ customRoutes.length }})
        </button>
      </div>
    </div>

    <!-- 推荐路线列表 -->
    <div v-if="activeTab === 'recommend'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

    <!-- 我的行程列表 -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="customRoutes.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500 text-lg mb-4">还没有创建任何行程</p>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          立即创建行程
        </button>
      </div>
      
      <div v-else class="space-y-6">
        <div
          v-for="route in customRoutes"
          :key="route.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ route.name }}</h3>
                <p class="text-gray-500 text-sm mt-1">{{ route.days }}天行程 · {{ route.attractions.length }}个景点</p>
              </div>
              <div class="flex items-center space-x-2">
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
            </div>
            
            <!-- 每日行程预览 -->
            <div class="space-y-3 mb-4">
              <div
                v-for="(day, index) in route.dailyPlan"
                :key="index"
                class="bg-gray-50 rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-900">第{{ index + 1 }}天</span>
                  <span class="text-sm text-gray-500">{{ day.date || '未设置日期' }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="attrId in day.attractions"
                    :key="attrId"
                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {{ getAttractionName(attrId) }}
                  </span>
                  <span v-if="day.attractions.length === 0" class="text-gray-400 text-xs">暂无安排</span>
                </div>
                <p v-if="day.notes" class="text-sm text-gray-600 mt-2">{{ day.notes }}</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-3">
                <button
                  @click="editCustomRoute(route)"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  编辑行程
                </button>
                <button
                  @click="deleteCustomRoute(route.id)"
                  class="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  删除
                </button>
              </div>
              <button
                @click="toggleCustomFavorite(route.id)"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                :class="isCustomFavorite(route.id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <svg class="h-4 w-4" :fill="isCustomFavorite(route.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="text-sm">{{ isCustomFavorite(route.id) ? '已收藏' : '收藏' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑行程模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- 模态框头部 -->
        <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
          <h2 class="text-xl font-bold">{{ editingRoute ? '编辑行程' : '创建新行程' }}</h2>
          <button @click="closeModal" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 模态框内容 -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- 基本信息 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">行程标题</label>
                <input
                  v-model="routeForm.name"
                  type="text"
                  placeholder="例如：武汉三日深度游"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">出行天数</label>
                <select
                  v-model="routeForm.days"
                  @change="adjustDailyPlan"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option v-for="d in 7" :key="d" :value="d">{{ d }}天</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">难度等级</label>
                <select
                  v-model="routeForm.difficulty"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">简单 - 轻松休闲</option>
                  <option value="medium">中等 - 适度挑战</option>
                  <option value="hard">困难 - 体力消耗</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">行程标签</label>
                <input
                  v-model="routeForm.tagsInput"
                  type="text"
                  placeholder="多个标签用逗号分隔，如：亲子游,文化之旅"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <!-- 每日行程规划 -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">每日行程安排</h3>
            <div class="space-y-4">
              <div
                v-for="(day, index) in routeForm.dailyPlan"
                :key="index"
                class="bg-gray-50 rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-900">第 {{ index + 1 }} 天</h4>
                  <button
                    @click="removeDay(index)"
                    v-if="routeForm.days > 1"
                    class="text-red-600 hover:text-red-700 text-sm"
                  >
                    删除此天
                  </button>
                </div>
                
                <!-- 日期选择 -->
                <div class="mb-3">
                  <label class="block text-sm text-gray-600 mb-1">出发日期（可选）</label>
                  <input
                    v-model="day.date"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <!-- 选择景点 -->
                <div class="mb-3">
                  <label class="block text-sm text-gray-600 mb-1">选择景点</label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="attrId in day.attractions"
                      :key="attrId"
                      class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
                    >
                      {{ getAttractionName(attrId) }}
                      <button @click="removeAttraction(index, attrId)" class="ml-1 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  </div>
                  <select
                    @change="addAttraction(index, $event)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">添加景点...</option>
                    <option
                      v-for="attraction in availableAttractions(day.attractions)"
                      :key="attraction.id"
                      :value="attraction.id"
                    >
                      {{ attraction.name }} - {{ attraction.city }}
                    </option>
                  </select>
                </div>
                
                <!-- 时间安排 -->
                <div class="mb-3">
                  <label class="block text-sm text-gray-600 mb-1">时间安排</label>
                  <input
                    v-model="day.schedule"
                    type="text"
                    placeholder="例如：09:00 出发，12:00 午餐，14:00 游览"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <!-- 出行交通 -->
                <div class="mb-3">
                  <label class="block text-sm text-gray-600 mb-1">交通方式</label>
                  <select
                    v-model="day.transportation"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">选择交通方式</option>
                    <option value="自驾">自驾</option>
                    <option value="公共交通">公共交通</option>
                    <option value="高铁">高铁</option>
                    <option value="飞机">飞机</option>
                    <option value="步行">步行</option>
                  </select>
                </div>
                
                <!-- 备注 -->
                <div>
                  <label class="block text-sm text-gray-600 mb-1">备注说明</label>
                  <textarea
                    v-model="day.notes"
                    rows="2"
                    placeholder="添加当天行程的特别说明、注意事项等..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- 添加天数按钮 -->
            <button
              v-if="routeForm.days < 7"
              @click="routeForm.days++; adjustDailyPlan()"
              class="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>添加一天</span>
            </button>
          </div>
        </div>
        
        <!-- 模态框底部 -->
        <div class="p-4 bg-gray-50 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveRoute"
            :disabled="!routeForm.name"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ editingRoute ? '保存修改' : '创建行程' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { routes, attractions } from '../data/attractions'

const router = useRouter()

// 状态
const activeTab = ref<'recommend' | 'custom'>('recommend')
const favorites = ref<string[]>([])
const customRoutes = ref<any[]>([])
const showCreateModal = ref(false)
const editingRoute = ref<any>(null)

// 表单数据
const routeForm = ref({
  name: '',
  days: 1,
  difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  tagsInput: '',
  dailyPlan: [{ date: '', attractions: [] as string[], schedule: '', transportation: '', notes: '' }]
})

// 初始化每日计划
const adjustDailyPlan = () => {
  const current = routeForm.value.dailyPlan
  if (routeForm.value.days > current.length) {
    for (let i = current.length; i < routeForm.value.days; i++) {
      current.push({ date: '', attractions: [], schedule: '', transportation: '', notes: '' })
    }
  } else if (routeForm.value.days < current.length) {
    current.splice(routeForm.value.days)
  }
}

// 获取景点名称
const getAttractionName = (id: string) => {
  const attraction = attractions.find(a => a.id === id)
  return attraction ? attraction.name : '未知景点'
}

// 可选择的景点
const availableAttractions = (selected: string[]) => {
  return attractions.filter(a => !selected.includes(a.id))
}

// 添加景点到某天
const addAttraction = (dayIndex: number, event: Event) => {
  const select = event.target as HTMLSelectElement
  const attractionId = select.value
  if (attractionId && !routeForm.value.dailyPlan[dayIndex].attractions.includes(attractionId)) {
    routeForm.value.dailyPlan[dayIndex].attractions.push(attractionId)
  }
  select.value = ''
}

// 从某天移除景点
const removeAttraction = (dayIndex: number, attractionId: string) => {
  const index = routeForm.value.dailyPlan[dayIndex].attractions.indexOf(attractionId)
  if (index > -1) {
    routeForm.value.dailyPlan[dayIndex].attractions.splice(index, 1)
  }
}

// 删除某天
const removeDay = (index: number) => {
  if (routeForm.value.days > 1) {
    routeForm.value.days--
    routeForm.value.dailyPlan.splice(index, 1)
  }
}

// 查看推荐路线详情
const viewRouteDetail = (id: string) => {
  router.push(`/routes/${id}`)
}

// 收藏推荐路线
const toggleFavorite = (id: string) => {
  const index = favorites.value.indexOf(id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem('routeFavorites', JSON.stringify(favorites.value))
}

const isFavorite = (id: string) => {
  return favorites.value.includes(id)
}

// 收藏自定义路线
const toggleCustomFavorite = (id: string) => {
  const customFavorites = getCustomFavorites()
  const index = customFavorites.indexOf(id)
  if (index > -1) {
    customFavorites.splice(index, 1)
  } else {
    customFavorites.push(id)
  }
  localStorage.setItem('customRouteFavorites', JSON.stringify(customFavorites))
}

const isCustomFavorite = (id: string) => {
  return getCustomFavorites().includes(id)
}

const getCustomFavorites = () => {
  const saved = localStorage.getItem('customRouteFavorites')
  return saved ? JSON.parse(saved) : []
}

// 编辑自定义路线
const editCustomRoute = (route: any) => {
  editingRoute.value = route
  routeForm.value = {
    name: route.name,
    days: route.days,
    difficulty: route.difficulty,
    tagsInput: route.tags.join(','),
    dailyPlan: route.dailyPlan.map((day: any) => ({
      date: day.date || '',
      attractions: [...(day.attractions || [])],
      schedule: day.schedule || '',
      transportation: day.transportation || '',
      notes: day.notes || ''
    }))
  }
  showCreateModal.value = true
}

// 删除自定义路线
const deleteCustomRoute = (id: string) => {
  if (confirm('确定要删除这个行程吗？')) {
    customRoutes.value = customRoutes.value.filter(r => r.id !== id)
    localStorage.setItem('customRoutes', JSON.stringify(customRoutes.value))
  }
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  editingRoute.value = null
  routeForm.value = {
    name: '',
    days: 1,
    difficulty: 'easy',
    tagsInput: '',
    dailyPlan: [{ date: '', attractions: [], schedule: '', transportation: '', notes: '' }]
  }
}

// 保存路线
const saveRoute = () => {
  if (!routeForm.value.name) return
  
  const tags = routeForm.value.tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
  
  const routeData = {
    id: editingRoute.value?.id || `custom_${Date.now()}`,
    name: routeForm.value.name,
    days: routeForm.value.days,
    difficulty: routeForm.value.difficulty,
    tags,
    dailyPlan: routeForm.value.dailyPlan,
    attractions: [...new Set(routeForm.value.dailyPlan.flatMap(d => d.attractions))],
    createdAt: editingRoute.value?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  if (editingRoute.value) {
    const index = customRoutes.value.findIndex(r => r.id === editingRoute.value.id)
    if (index > -1) {
      customRoutes.value[index] = routeData
    }
  } else {
    customRoutes.value.unshift(routeData)
  }
  
  localStorage.setItem('customRoutes', JSON.stringify(customRoutes.value))
  closeModal()
}

// 生命周期
onMounted(() => {
  // 加载推荐路线收藏
  const savedFavorites = localStorage.getItem('routeFavorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  // 加载自定义路线
  const savedRoutes = localStorage.getItem('customRoutes')
  if (savedRoutes) {
    customRoutes.value = JSON.parse(savedRoutes)
  }
})
</script>
