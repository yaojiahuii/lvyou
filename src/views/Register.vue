<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">湖</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          注册湖北智能旅游
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          已有账户？
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            立即登录
          </router-link>
        </p>
      </div>

      <!-- 注册表单 -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">姓名</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入您的姓名"
            >
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">邮箱地址</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入邮箱地址"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入密码（至少6位）"
            >
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">确认密码</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请再次输入密码"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">用户角色</label>
            <div class="mt-1 flex space-x-4">
              <label class="inline-flex items-center">
                <input
                  v-model="form.role"
                  type="radio"
                  value="user"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked
                >
                <span class="ml-2 text-sm text-gray-700">普通用户</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  v-model="form.role"
                  type="radio"
                  value="admin"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                >
                <span class="ml-2 text-sm text-gray-700">管理员</span>
              </label>
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">联系电话</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入联系电话（可选）"
            >
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <!-- 成功信息 -->
        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </h3>
            </div>
          </div>
        </div>

        <!-- 注册按钮 -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, quickLogin } = useAuth()

// 表单数据
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user' as 'user' | 'admin',
  phone: ''
})

// 密码强度检查函数
const checkPasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含大写字母' }
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含小写字母' }
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: '密码必须包含数字' }
  }
  
  return { valid: true, message: '密码强度良好' }
}

// 状态
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 处理注册
const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 验证密码
    if (form.password !== form.confirmPassword) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    // 使用新的密码强度检查
    const passwordCheck = checkPasswordStrength(form.password)
    if (!passwordCheck.valid) {
      errorMessage.value = passwordCheck.message
      return
    }

    // 模拟注册过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 创建新用户
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    })

    if (!result.user || result.error) {
      errorMessage.value = result.error || '注册失败，请重试'
      return
    }

    const newUser = result.user

    // 自动登录并持久化记住用户
    const userSession = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
      loginTime: new Date().toISOString()
    }
    quickLogin(userSession)
    localStorage.setItem('rememberedUser', JSON.stringify(userSession))

    successMessage.value = `注册成功！您已成为${newUser.role === 'admin' ? '管理员' : '普通用户'}，正在跳转...`
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error) {
    errorMessage.value = '注册失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>
