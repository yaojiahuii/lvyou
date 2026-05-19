<template>
  <div class="ai-chat-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">AI旅游助手</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          智能对话，个性化推荐，让您的旅行更加轻松愉快
        </p>
      </div>

      <!-- 功能卡片区域 -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg mb-2">景点推荐</h3>
          <p class="text-gray-600 text-sm">根据您的兴趣推荐合适的旅游景点和目的地</p>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg mb-2">路线规划</h3>
          <p class="text-gray-600 text-sm">帮您制定个性化的旅游路线和行程安排</p>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg mb-2">实时信息</h3>
          <p class="text-gray-600 text-sm">提供天气、交通、住宿等实时旅游信息</p>
        </div>
      </div>

      <!-- 快速问题示例 -->
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
        <h3 class="font-semibold text-lg mb-4">您可以这样问我：</h3>
        <div class="grid md:grid-cols-2 gap-3">
          <button 
            v-for="(question, index) in quickQuestions" 
            :key="index"
            @click="sendQuickQuestion(question)"
            class="text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm text-gray-700 cursor-pointer"
          >
            {{ question }}
          </button>
        </div>
      </div>

      <!-- AI聊天组件 -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <AIChat ref="aiChatRef" />
      </div>

      <!-- 底部信息 -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>AI旅游助手会尽力为您提供准确的信息，但建议您在实际出行前确认最新的旅游信息</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AIChat from '../components/AIChat.vue'

const aiChatRef = ref<InstanceType<typeof AIChat>>()
const showSuggestions = ref(true)

const quickQuestions = ref([
  '推荐几个武汉必去的景点',
  '帮我规划一个3天的湖北旅游路线',
  '最近湖北的天气怎么样？',
  '从武汉到宜昌怎么去最方便？',
  '湖北有哪些特色美食推荐？',
  '适合带小孩去的湖北景点有哪些？'
])

// 点击快捷问题，直接发送给AI
const sendQuickQuestion = (question: string) => {
  if (aiChatRef.value && typeof (aiChatRef.value as any).sendMessageWithText === 'function') {
    ;(aiChatRef.value as any).sendMessageWithText(question)
    // 隐藏建议区域
    showSuggestions.value = false
  }
}
</script>

<style scoped>
.ai-chat-page {
  min-height: calc(100vh - 80px); /* 减去导航栏高度 */
}
</style>