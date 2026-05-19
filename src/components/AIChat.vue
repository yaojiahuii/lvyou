<template>
  <div class="ai-chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header bg-blue-600 text-white p-4 rounded-t-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10c0-1.777.833-3.366 2.125-4.4A5 5 0 0010 11z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-lg">AI旅游助手</h3>
            <p class="text-blue-200 text-sm">随时为您提供旅游建议</p>
          </div>
        </div>
        <button @click="toggleChat" class="text-blue-200 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div ref="messagesContainer" class="messages-container bg-white p-4 h-96 overflow-y-auto">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-16">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <p>您好！我是AI旅游助手，可以为您：</p>
        <ul class="mt-2 text-sm space-y-1">
          <li>• 推荐旅游景点和路线</li>
          <li>• 解答旅游相关问题</li>
          <li>• 提供当地天气和交通信息</li>
          <li>• 制定个性化旅游计划</li>
        </ul>
      </div>

      <div v-else class="space-y-4">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message flex', message.type === 'user' ? 'justify-end' : 'justify-start']">
          <div class="flex items-start space-x-3 max-w-full group">
            <!-- AI消息：头像在左边 -->
            <div v-if="message.type === 'ai'" class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10c0-1.777.833-3.366 2.125-4.4A5 5 0 0010 11z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <!-- 消息气泡 -->
            <div :class="['message-bubble relative', message.type === 'user' ? 'bg-blue-500 text-white order-2' : 'bg-gray-100 text-gray-800 order-1']">
              <!-- 引用消息 -->
              <div v-if="message.quotedText" :class="['quoted-message mb-2 p-2 rounded text-sm', message.type === 'user' ? 'bg-blue-400' : 'bg-gray-200']">
                <div class="text-xs opacity-70 mb-1">引用:</div>
                <div class="line-clamp-2">{{ message.quotedText }}</div>
              </div>
              
              <p class="whitespace-pre-wrap">{{ message.content }}</p>
              <span class="timestamp text-xs opacity-70 mt-1 block">{{ formatTime(message.timestamp) }}</span>
              
              <!-- 操作按钮 -->
              <div :class="['message-actions absolute -bottom-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity', message.type === 'user' ? 'right-0' : 'left-0']">
                <!-- 引用 -->
                <button @click="quoteMessage(message)" class="p-1 rounded-full bg-white shadow hover:bg-gray-100" title="引用">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </button>
                <!-- 复制 -->
                <button @click="copyMessage(message.content)" class="p-1 rounded-full bg-white shadow hover:bg-gray-100" title="复制">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
                <!-- 重新生成 (仅AI消息) -->
                <button v-if="message.type === 'ai' && index === lastAiIndex" @click="regenerateResponse(index)" class="p-1 rounded-full bg-white shadow hover:bg-gray-100" title="重新生成">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
                <!-- 删除 -->
                <button @click="deleteMessage(index)" class="p-1 rounded-full bg-white shadow hover:bg-red-100" title="删除">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 用户消息：头像在右边 -->
            <div v-if="message.type === 'user'" class="flex-shrink-0 order-3">
              <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="ai-message">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10c0-1.777.833-3.366 2.125-4.4A5 5 0 0010 11z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="bg-gray-100 rounded-lg p-3">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 引用提示 -->
    <div v-if="quotedMessage" class="bg-blue-50 border-t border-blue-200 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2 text-sm text-blue-700">
        <span>引用:</span>
        <span class="line-clamp-1">{{ quotedMessage.content }}</span>
      </div>
      <button @click="cancelQuote" class="text-blue-500 hover:text-blue-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- 输入区域 -->
    <div class="input-container border-t border-gray-200 p-4">
      <form @submit.prevent="sendMessage" class="flex space-x-3">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="输入您的问题..."
          :disabled="isLoading"
          class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          :disabled="!inputMessage.trim() || isLoading"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          发送
        </button>
      </form>
    </div>
    
    <!-- Toast提示 -->
    <Transition name="fade">
      <div v-if="toast.show" :class="['toast fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm', toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white']">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAIService } from '../composables/useAIService'

interface Message {
  type: 'user' | 'ai'
  content: string
  timestamp: string
  quotedText?: string
}

const { sendMessageToAI } = useAIService()
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()
const quotedMessage = ref<Message | null>(null)

// Toast提示
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'info'
})

const showToast = (message: string, type: 'success' | 'info' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const STORAGE_KEY = 'ai_chat_messages'

// 始终显示完整的日期+时间
const formatTime = (dateStr: string | Date) => {
  let d: Date
  if (typeof dateStr === 'string') {
    // 兼容旧格式 "20:31"
    if (/^\d{1,2}:\d{2}$/.test(dateStr)) return dateStr
    d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
  } else {
    d = dateStr
  }
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    // 今天：只显示时间
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (d.getFullYear() === now.getFullYear()) {
    // 今年非今天：显示月/日 时间
    return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    // 其他年份：显示完整日期时间
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
}

// 获取最后一个AI消息的索引
const lastAiIndex = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].type === 'ai') {
      return i
    }
  }
  return -1
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 保存消息到本地存储
const saveMessages = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

// 加载历史消息
const loadMessages = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      messages.value = JSON.parse(saved)
    } catch (e) {
      messages.value = []
    }
  }
}

// 引用消息
const quoteMessage = (message: Message) => {
  quotedMessage.value = message
  showToast('已引用消息', 'info')
}

// 取消引用
const cancelQuote = () => {
  quotedMessage.value = null
}

// 复制消息
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    showToast('已复制到剪贴板', 'success')
  } catch (e) {
    showToast('复制失败', 'info')
  }
}

// 删除消息
const deleteMessage = (index: number) => {
  messages.value.splice(index, 1)
  saveMessages()
  showToast('消息已删除', 'info')
}

// 重新生成AI回复
const regenerateResponse = async (aiIndex: number) => {
  // 找到对应的用户消息
  let userMessageIndex = -1
  for (let i = aiIndex - 1; i >= 0; i--) {
    if (messages.value[i].type === 'user') {
      userMessageIndex = i
      break
    }
  }
  
  if (userMessageIndex === -1) return
  
  // 删除AI的回复
  messages.value.splice(aiIndex, 1)
  saveMessages()
  
  // 重新发送用户消息
  const userMsg = messages.value[userMessageIndex]
  isLoading.value = true
  await scrollToBottom()
  
  try {
    const aiResponse = await sendMessageToAI(userMsg.content)
    const aiMessage: Message = {
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    }
    messages.value.push(aiMessage)
    saveMessages()
    showToast('已重新生成回复', 'success')
  } catch (error) {
    const errorMessage: Message = {
      type: 'ai',
      content: '抱歉，我暂时无法回答您的问题。请稍后再试。',
      timestamp: new Date().toISOString()
    }
    messages.value.push(errorMessage)
    saveMessages()
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const sendMessage = async (text?: string) => {
  const messageText = text || inputMessage.value
  if (!messageText?.trim()) return

  const userMessage: Message = {
    type: 'user',
    content: messageText.trim(),
    timestamp: new Date().toISOString()
  }
  
  // 如果有引用，添加到消息中
  if (quotedMessage.value) {
    userMessage.quotedText = quotedMessage.value.content
    quotedMessage.value = null
  }

  messages.value.push(userMessage)
  saveMessages()
  if (!text) inputMessage.value = ''
  isLoading.value = true

  await scrollToBottom()

  try {
    const aiResponse = await sendMessageToAI(messageText)
    const aiMessage: Message = {
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    }
    
    messages.value.push(aiMessage)
    saveMessages()
  } catch (error) {
    const errorMessage: Message = {
      type: 'ai',
      content: '抱歉，我暂时无法回答您的问题。请稍后再试。',
      timestamp: new Date().toISOString()
    }
    messages.value.push(errorMessage)
    saveMessages()
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const toggleChat = () => {
  console.log('Toggle chat')
}

onMounted(() => {
  loadMessages()
  
  if (messages.value.length === 0) {
    const welcomeMessage: Message = {
      type: 'ai',
      content: '您好！我是AI旅游助手，很高兴为您服务！我可以为您推荐旅游景点、解答旅游相关问题、提供当地信息等。有什么可以帮助您的吗？',
      timestamp: new Date().toISOString()
    }
    messages.value.push(welcomeMessage)
    saveMessages()
  }
})

defineExpose({
  sendMessageWithText: (text: string) => sendMessage(text)
})
</script>

<style scoped>
.ai-chat-container {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.messages-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f7fafc;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.message-bubble {
  max-width: 70%;
  border-radius: 18px;
  padding: 12px 16px;
  word-wrap: break-word;
}

.user-message .message-bubble {
  border-bottom-right-radius: 4px;
}

.ai-message .message-bubble {
  border-bottom-left-radius: 4px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.toast {
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
