import { ref } from 'vue'
import { ApiService } from '../services/api'

// 对话消息类型
interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export const useAIService = () => {
  const conversationHistory = ref<Message[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 发送消息给AI
  const sendMessageToAI = async (message: string): Promise<string> => {
    isLoading.value = true
    error.value = null

    try {
      // 将用户消息添加到历史记录
      conversationHistory.value.push({ role: 'user', content: message })

      // 准备发送给后端的messages（只包含对话内容，不包含系统消息）
      const messages = conversationHistory.value
        .filter(msg => msg.role !== 'system')
        .map(msg => ({ role: msg.role, content: msg.content }))

      // 调用后端AI接口
      const response = await ApiService.chatWithAI(messages)

      if (response.success && response.data) {
        const aiResponse = response.data.content
        // 将AI回复添加到历史记录
        conversationHistory.value.push({ role: 'assistant', content: aiResponse })
        return aiResponse
      } else {
        throw new Error(response.message || 'AI回复失败')
      }
    } catch (err: any) {
      console.error('AI对话错误:', err)
      error.value = err.message || 'AI服务暂时不可用，请稍后重试'
      
      // 返回友好提示
      const errorMessage = err.message?.includes('API Key')
        ? 'AI服务未配置，请联系管理员配置通义千问API Key'
        : '抱歉，AI助手暂时无法回复，请稍后重试'

      conversationHistory.value.push({ role: 'assistant', content: errorMessage })
      return errorMessage
    } finally {
      isLoading.value = false
    }
  }

  // 清空对话历史
  const clearConversation = () => {
    conversationHistory.value = []
    error.value = null
  }

  return {
    sendMessageToAI,
    clearConversation,
    conversationHistory,
    isLoading,
    error
  }
}
