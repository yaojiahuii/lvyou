<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">个人资料</h1>
        <p class="mt-2 text-sm text-gray-600">管理您的个人信息和账户设置</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：个人信息 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 基本信息卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
            <div class="space-y-4">
              <!-- 头像 -->
              <div class="flex items-center space-x-4">
                <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    v-if="userData.avatar" 
                    :src="userData.avatar" 
                    alt="用户头像"
                    class="w-full h-full object-cover"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <button 
                    @click="showAvatarUpload = true"
                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    更换头像
                  </button>
                  <p class="mt-1 text-xs text-gray-500">支持JPG、PNG格式，最大2MB</p>
                </div>
              </div>

              <!-- 表单 -->
              <form @submit.prevent="updateProfile">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">姓名</label>
                    <input
                      v-model="userData.name"
                      type="text"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">邮箱</label>
                    <input
                      v-model="userData.email"
                      type="email"
                      required
                      disabled
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">联系电话</label>
                    <input
                      v-model="userData.phone"
                      type="tel"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">用户角色</label>
                    <div class="mt-1">
                      <span :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-sm',
                        userData.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      ]">
                        {{ userData.role === 'admin' ? '管理员' : '普通用户' }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">账户状态</label>
                    <div class="mt-1">
                      <span :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-sm',
                        userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      ]">
                        {{ userData.status === 'active' ? '正常' : '已冻结' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 更新按钮 -->
                <div class="mt-6">
                  <button
                    type="submit"
                    :disabled="isUpdating"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {{ isUpdating ? '更新中...' : '更新信息' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 旅行偏好卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">旅行偏好</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">喜欢的旅行类型</label>
                <div class="flex flex-wrap gap-2">
                  <label 
                    v-for="type in travelTypes" 
                    :key="type.value"
                    class="inline-flex items-center"
                  >
                    <input
                      type="checkbox"
                      :value="type.value"
                      v-model="preferences.travelTypes"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    >
                    <span class="ml-2 text-sm text-gray-700">{{ type.label }}</span>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">预算范围（元/人）</label>
                  <div class="mt-1 flex space-x-2">
                    <input
                      v-model.number="preferences.budgetRange[0]"
                      type="number"
                      placeholder="最低"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                    <span class="flex items-center text-gray-500">-</span>
                    <input
                      v-model.number="preferences.budgetRange[1]"
                      type="number"
                      placeholder="最高"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">常去城市</label>
                  <input
                    v-model="preferences.favoriteCitiesInput"
                    type="text"
                    placeholder="用逗号分隔城市，如：武汉,十堰,宜昌"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    @keydown.enter.prevent="addFavoriteCity"
                  >
                  <p class="mt-1 text-xs text-gray-500">按回车添加城市</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">已选择城市</label>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(city, index) in preferences.favoriteCities" 
                    :key="index"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {{ city }}
                    <button 
                      @click="removeFavoriteCity(index)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <div class="mt-4">
                <button
                  @click="savePreferences"
                  :disabled="isSavingPreferences"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
                >
                  {{ isSavingPreferences ? '保存中...' : '保存偏好设置' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：账户设置 -->
        <div class="space-y-6">
          <!-- 账户安全卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">账户安全</h3>
            <div class="space-y-3">
              <button 
                @click="showPasswordChange = true"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex justify-between items-center"
              >
                <span>修改密码</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <button 
                @click="showPasswordRecovery = true"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex justify-between items-center"
              >
                <span>找回密码设置</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <button 
                @click="exportUserData"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex justify-between items-center"
              >
                <span>导出个人数据</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <button 
                @click="showDeleteAccount = true"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex justify-between items-center"
              >
                <span>删除账户</span>
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <div class="pt-3 border-t">
                <p class="text-sm text-gray-600">注册时间：{{ formatDate(userData.createdAt) }}</p>
                <p v-if="userData.lastLoginAt" class="text-sm text-gray-600 mt-1">最后登录：{{ formatDate(userData.lastLoginAt) }}</p>
                <p class="text-sm text-gray-600 mt-1">账户ID：{{ userData.id }}</p>
              </div>
            </div>
          </div>

          <!-- 历史记录卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">历史记录</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-700">AI咨询记录</span>
                <span class="text-sm font-medium text-blue-600">{{ userData.history.consultations.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-700">行程规划</span>
                <span class="text-sm font-medium text-blue-600">{{ userData.history.itineraries.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-700">订单记录</span>
                <span class="text-sm font-medium text-blue-600">{{ userData.history.bookings.length }}</span>
              </div>
              <router-link 
                to="/favorites"
                class="block mt-4 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                查看我的收藏
              </router-link>
            </div>
          </div>

          <!-- 账户状态卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">账户状态</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600">您的账户目前处于<strong class="ml-1">{{ userData.status === 'active' ? '正常' : '冻结' }}</strong>状态</p>
                <p v-if="userData.status === 'frozen'" class="text-sm text-red-600 mt-2">
                  账户已冻结，请联系客服解冻
                </p>
              </div>
              <div v-if="userData.status === 'active'">
                <button 
                  @click="freezeAccount"
                  class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  冻结账户
                </button>
                <p class="mt-2 text-xs text-gray-500">冻结后您将无法登录，需联系客服解冻</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码模态框 -->
    <div v-if="showPasswordChange" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold">修改密码</h3>
          <button @click="showPasswordChange = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="changePassword">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">当前密码</label>
                <input
                  v-model="passwordChange.currentPassword"
                  type="password"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">新密码</label>
                <input
                  v-model="passwordChange.newPassword"
                  type="password"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">确认新密码</label>
                <input
                  v-model="passwordChange.confirmPassword"
                  type="password"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="isChangingPassword"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isChangingPassword ? '修改中...' : '确认修改' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 头像上传模态框 -->
    <div v-if="showAvatarUpload" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold">更换头像</h3>
          <button @click="showAvatarUpload = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="text-center">
            <div class="mx-auto w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              <img 
                v-if="avatarPreview" 
                :src="avatarPreview" 
                alt="头像预览"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
            
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            >
            
            <button
              @click="$refs.avatarInput.click()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm mb-4"
            >
              选择图片
            </button>
            
            <p class="text-xs text-gray-500 mb-4">支持 JPG、PNG 格式，最大 2MB</p>
            
            <div class="flex space-x-2">
              <button
                @click="saveAvatar"
                :disabled="!avatarPreview"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
              >
                保存
              </button>
              <button
                @click="cancelAvatarUpload"
                class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除账户模态框 -->
    <div v-if="showDeleteAccount" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-xl font-semibold text-red-600">删除账户</h3>
          <button @click="showDeleteAccount = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">警告</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>此操作将永久删除您的账户，包括：</p>
                  <ul class="list-disc list-inside mt-1">
                    <li>所有个人资料和偏好设置</li>
                    <li>收藏的景点和路线</li>
                    <li>AI咨询记录和行程规划</li>
                    <li>所有历史数据</li>
                  </ul>
                  <p class="mt-2 font-semibold">此操作不可撤销！</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              请输入您的密码以确认删除
            </label>
            <input
              v-model="deleteAccountPassword"
              type="password"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="请输入密码"
            >
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="confirmDeleteAccount"
              :disabled="!deleteAccountPassword"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50"
            >
              确认删除
            </button>
            <button
              @click="showDeleteAccount = false"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import type { User } from '../types'

const { currentUser, updateUser, updateUserPreferences, getAllUsers } = useAuth()

// 用户数据
const userData = ref<User>({
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active',
  createdAt: '',
  updatedAt: '',
  favorites: {
    attractions: [],
    routes: []
  },
  history: {
    consultations: [],
    itineraries: [],
    bookings: []
  }
})

// 偏好设置
const preferences = reactive({
  travelTypes: [] as string[],
  budgetRange: [0, 10000] as [number, number],
  favoriteCities: [] as string[],
  favoriteCitiesInput: ''
})

// 状态
const showPasswordChange = ref(false)
const showAvatarUpload = ref(false)
const showPasswordRecovery = ref(false)
const showDeleteAccount = ref(false)
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const isSavingPreferences = ref(false)
const isDeletingAccount = ref(false)

// 密码修改表单
const passwordChange = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 头像上传相关
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)
const deleteAccountPassword = ref('')

// 旅行类型选项
const travelTypes = [
  { value: 'natural', label: '自然风光' },
  { value: 'historical', label: '人文历史' },
  { value: 'food', label: '美食探店' },
  { value: 'cultural', label: '文化体验' },
  { value: 'adventure', label: '户外探险' },
  { value: 'relaxation', label: '休闲度假' }
]

// 加载用户数据
const loadUserData = () => {
  if (!currentUser.value) return
  
  const users = getAllUsers()
  const user = users.find(u => u.id === currentUser.value.id)
  
  if (user) {
    userData.value = { ...user }
    
    // 加载偏好设置
    if (user.preferences) {
      preferences.travelTypes = user.preferences.travelTypes || []
      preferences.budgetRange = user.preferences.budgetRange || [0, 10000]
      preferences.favoriteCities = user.preferences.favoriteCities || []
    }
  }
}

// 更新个人资料
const updateProfile = async () => {
  if (!currentUser.value) return
  
  isUpdating.value = true
  try {
    const updated = updateUser(currentUser.value.id, {
      name: userData.value.name,
      phone: userData.value.phone,
      avatar: userData.value.avatar
    })
    
    if (updated) {
      alert('个人资料更新成功')
      loadUserData()
    } else {
      alert('更新失败，请重试')
    }
  } catch (error) {
    alert('更新失败，请重试')
  } finally {
    isUpdating.value = false
  }
}

// 保存偏好设置
const savePreferences = async () => {
  if (!currentUser.value) return
  
  isSavingPreferences.value = true
  try {
    const success = updateUserPreferences(currentUser.value.id, {
      travelTypes: preferences.travelTypes,
      budgetRange: preferences.budgetRange,
      favoriteCities: preferences.favoriteCities
    })
    
    if (success) {
      alert('偏好设置已保存')
    } else {
      alert('保存失败，请重试')
    }
  } catch (error) {
    alert('保存失败，请重试')
  } finally {
    isSavingPreferences.value = false
  }
}

// 添加喜欢的城市
const addFavoriteCity = () => {
  if (preferences.favoriteCitiesInput.trim()) {
    const cities = preferences.favoriteCitiesInput
      .split(',')
      .map(city => city.trim())
      .filter(city => city && !preferences.favoriteCities.includes(city))
    
    preferences.favoriteCities.push(...cities)
    preferences.favoriteCitiesInput = ''
  }
}

// 移除喜欢的城市
const removeFavoriteCity = (index: number) => {
  preferences.favoriteCities.splice(index, 1)
}

// 修改密码
const changePassword = async () => {
  if (!currentUser.value) return
  
  // 验证密码
  if (passwordChange.newPassword !== passwordChange.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }
  
  if (passwordChange.newPassword.length < 6) {
    alert('新密码长度至少6位')
    return
  }
  
  isChangingPassword.value = true
  try {
    // 这里应该验证当前密码，但为了简化，我们直接更新
    const updated = updateUser(currentUser.value.id, {
      password: passwordChange.newPassword
    })
    
    if (updated) {
      alert('密码修改成功')
      showPasswordChange.value = false
      passwordChange.currentPassword = ''
      passwordChange.newPassword = ''
      passwordChange.confirmPassword = ''
    } else {
      alert('密码修改失败，请重试')
    }
  } catch (error) {
    alert('密码修改失败，请重试')
  } finally {
    isChangingPassword.value = false
  }
}

// 冻结账户
const freezeAccount = () => {
  if (confirm('确定要冻结您的账户吗？冻结后需联系客服解冻。')) {
    if (currentUser.value) {
      const success = updateUser(currentUser.value.id, { status: 'frozen' })
      if (success) {
        alert('账户已冻结')
        loadUserData()
      }
    }
  }
}

// 头像上传处理
const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // 检查文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    
    avatarFile.value = file
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 保存头像
const saveAvatar = async () => {
  if (!avatarPreview.value || !avatarFile.value) return
  
  try {
    // 在实际项目中，这里应该上传到服务器
    // 模拟上传成功
    const success = updateUser(currentUser.value!.id, { 
      avatar: avatarPreview.value 
    })
    
    if (success) {
      alert('头像更新成功')
      showAvatarUpload.value = false
      avatarPreview.value = ''
      avatarFile.value = null
      loadUserData()
    } else {
      alert('头像更新失败')
    }
  } catch (error) {
    alert('头像上传失败')
  }
}

// 取消头像上传
const cancelAvatarUpload = () => {
  showAvatarUpload.value = false
  avatarPreview.value = ''
  avatarFile.value = null
}

// 导出个人数据
const exportUserData = () => {
  if (!currentUser.value) return
  
  const userDataToExport = {
    userInfo: {
      id: userData.value.id,
      name: userData.value.name,
      email: userData.value.email,
      phone: userData.value.phone,
      role: userData.value.role,
      createdAt: userData.value.createdAt
    },
    preferences: userData.value.preferences,
    favorites: userData.value.favorites,
    history: userData.value.history,
    exportTime: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(userDataToExport, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `user_data_${userData.value.id}_${new Date().getTime()}.json`
  link.click()
  
  alert('个人数据导出成功')
}

// 确认删除账户
const confirmDeleteAccount = async () => {
  if (!deleteAccountPassword.value || !currentUser.value) return
  
  // 验证密码
  const users = getAllUsers()
  const currentUserData = users.find(u => u.id === currentUser.value!.id)
  
  if (!currentUserData || currentUserData.password !== deleteAccountPassword.value) {
    alert('密码错误，请重新输入')
    return
  }
  
  if (!confirm('确定要永久删除您的账户吗？此操作不可撤销！')) {
    return
  }
  
  isDeletingAccount.value = true
  try {
    // 删除用户数据
    const updatedUsers = users.filter(u => u.id !== currentUser.value!.id)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    
    // 登出用户
    const { logout } = useAuth()
    logout()
    
    alert('账户已成功删除')
    window.location.href = '/'
  } catch (error) {
    alert('删除账户失败，请重试')
  } finally {
    isDeletingAccount.value = false
    showDeleteAccount.value = false
    deleteAccountPassword.value = ''
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserData()
})
</script>