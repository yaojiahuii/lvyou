<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <!-- Logo -->
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          找回密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          输入您的邮箱地址，我们将发送密码重置链接
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">邮箱地址</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="请输入您的邮箱地址"
          >
        </div>

        <div v-if="step === 2" class="space-y-4">
          <div>
            <label for="verificationCode" class="block text-sm font-medium text-gray-700">验证码</label>
            <div class="mt-1 flex space-x-2">
              <input
                id="verificationCode"
                v-model="verificationCode"
                name="verificationCode"
                type="text"
                required
                maxlength="6"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="请输入6位验证码"
              >
              <button
                type="button"
                @click="sendVerificationCode"
                :disabled="countdown > 0"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {{ countdown > 0 ? `${countdown}s后重新发送` : '发送验证码' }}
              </button>
            </div>
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">新密码</label>
            <input
              id="newPassword"
              v-model="newPassword"
              name="newPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入新密码（至少6位）"
            >
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">确认新密码</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请再次输入新密码"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ isLoading ? '处理中...' : step === 1 ? '发送重置链接' : '重置密码' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            返回登录
          </router-link>
        </div>

        <!-- 状态提示 -->
        <div v-if="message" :class="['p-3 rounded-md text-sm', messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
          {{ message }}
        </div>
      </form>

      <!-- 安全提示 -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">安全提示</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>• 请确保您输入的邮箱地址与注册时一致</p>
              <p>• 验证码有效期为10分钟</p>
              <p>• 重置后请及时修改为安全密码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiService } from '../services/api'
import { resetPassword as resetUserPassword } from '../composables/useAuth'

const router = useRouter()

// 状态管理
const step = ref(1) // 1: 输入邮箱, 2: 验证码和重置密码
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const countdown = ref(0)
const message = ref('')
const messageType = ref<'success' | 'error'>('error')

// 发送验证码
const sendVerificationCode = async () => {
  if (!email.value) {
    showMessage('请输入邮箱地址', 'error')
    return
  }

  isLoading.value = true
  try {
    const response = await ApiService.sendVerificationCode(email.value)
    if (response.success) {
      // 启动倒计时
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)

      // 开发环境下显示验证码方便测试
      if (response.data?.code) {
        showMessage(`验证码已发送(开发模式): ${response.data.code}`, 'success')
        // 弹窗显示，确保用户能看到
        alert(`您的验证码是: ${response.data.code}`)
      } else {
        showMessage('验证码已发送，请注意查收', 'success')
      }
    } else {
      showMessage(response.message || '发送失败', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || '发送失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 处理忘记密码流程
const handleForgotPassword = async () => {
  if (step.value === 1) {
    await handleEmailSubmit()
  } else {
    await handlePasswordReset()
  }
}

// 处理邮箱提交
const handleEmailSubmit = async () => {
  if (!email.value) {
    showMessage('请输入邮箱地址', 'error')
    return
  }

  isLoading.value = true
  try {
    // 检查邮箱是否存在并发送验证码
    const response = await ApiService.sendVerificationCode(email.value)
    if (response.success) {
      step.value = 2
      // 启动倒计时
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)

      // 开发环境下显示验证码方便测试
      if (response.data?.code) {
        showMessage(`验证码已发送(开发模式): ${response.data.code}`, 'success')
        // 弹窗显示，确保用户能看到
        alert(`您的验证码是: ${response.data.code}`)
      } else {
        showMessage('验证码已发送，请查收', 'success')
      }
    } else {
      showMessage(response.message || '该邮箱未注册', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || '发送失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 处理密码重置
const handlePasswordReset = async () => {
  if (!verificationCode.value) {
    showMessage('请输入验证码', 'error')
    return
  }

  if (!newPassword.value || !confirmPassword.value) {
    showMessage('请输入新密码', 'error')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }

  if (newPassword.value.length < 6) {
    showMessage('密码长度至少6位', 'error')
    return
  }

  isLoading.value = true
  try {
    // 先验证验证码
    const verifyResponse = await ApiService.verifyCode(email.value, verificationCode.value)
    if (!verifyResponse.success) {
      showMessage(verifyResponse.message || '验证码错误', 'error')
      return
    }

    // 验证通过后重置密码
    const result = await resetUserPassword(email.value, newPassword.value)
    if (result.success) {
      showMessage('密码重置成功，请重新登录', 'success')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      showMessage(result.error || '密码重置失败', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || '密码重置失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}
</script>