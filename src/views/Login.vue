<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 头部 -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">湖</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          登录到湖北智能旅游
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          还没有账户？
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            立即注册
          </router-link>
        </p>
      </div>

      <!-- 登录表单 -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">邮箱地址</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="邮箱地址"
            >
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="密码"
            >
          </div>
        </div>

        <!-- 记住我 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              记住我
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
              忘记密码？
            </router-link>
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

        <!-- 登录按钮 -->
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
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>

        <!-- 忘记密码和注册链接 -->
        <div class="flex justify-between items-center text-sm">
          <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
            忘记密码？
          </router-link>
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            还没有账户？立即注册
          </router-link>
        </div>

        <!-- 演示账户 -->
        <div class="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 class="text-sm font-medium text-gray-900 mb-2">测试账户</h3>
          <div class="text-xs text-gray-600 space-y-1">
            <p><strong>管理员：</strong>admin@tourism.com / Admin123</p>
            <p><strong>普通用户：</strong>user1@tourism.com / User123</p>
            <div class="mt-2 pt-2 border-t border-gray-200">
              <button
                @click="fillAdminAccount"
                class="text-blue-600 hover:text-blue-500 underline mr-3"
              >
                填入管理员账户
              </button>
              <button
                @click="fillUserAccount"
                class="text-blue-600 hover:text-blue-500 underline"
              >
                填入普通用户
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, quickLogin } = useAuth()

// 表单数据
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// 状态
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 处理登录
const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 调用后端API登录
    const result = await login(form.email, form.password)

    if (result.user) {
      // 登录成功
      const userSession = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role || 'user',
        avatar: result.user.avatar,
        loginTime: new Date().toISOString()
      }
      
      // 如果选择记住我，保存到 localStorage
      if (form.rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify(userSession))
      }

      // 显示成功提示
      const roleText = result.user.role === 'admin' ? '管理员' : '普通用户'
      successMessage.value = `登录成功！欢迎${roleText} ${result.user.name}`

      // 延迟跳转，让用户看到提示
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      // 登录失败 - 错误消息将持续显示，不会自动清除
      errorMessage.value = result.error || '邮箱或密码错误'
      // 5秒后自动清除错误消息
      setTimeout(() => {
        errorMessage.value = ''
      }, 5000)
    }
  } catch (error: any) {
    // 捕获异常 - 错误消息将持续显示
    errorMessage.value = error.message || '登录失败，请重试'
    // 5秒后自动清除错误消息
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isLoading.value = false
  }
}

// 填入管理员账户
const fillAdminAccount = () => {
  form.email = 'admin@tourism.com'
  form.password = 'Admin123'
}

// 填入普通用户账户
const fillUserAccount = () => {
  form.email = 'user1@tourism.com'
  form.password = 'User123'
}

// 检查是否已有记住的用户
const checkRememberedUser = () => {
  const rememberedUser = localStorage.getItem('rememberedUser')
  if (rememberedUser) {
    const user = JSON.parse(rememberedUser)
    form.email = user.email
    form.rememberMe = true
  }
}

// 组件挂载时检查记住的用户
onMounted(() => {
  checkRememberedUser()
})
</script>