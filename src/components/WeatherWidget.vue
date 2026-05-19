<template>
  <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-sm opacity-90">武汉天气</div>
        <div class="text-xs opacity-75">{{ lastUpdate }}</div>
      </div>
      <div v-if="isLoading" class="text-sm opacity-75">加载中...</div>
    </div>
    
    <div v-if="error" class="text-sm opacity-90 bg-white bg-opacity-20 rounded p-2 mb-3">
      {{ error }}
    </div>
    
    <div v-if="!isLoading">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-5xl font-bold mb-2">{{ weather.temperature }}°C</div>
          <div class="text-lg opacity-90">{{ weather.condition }}</div>
        </div>
        <div class="text-6xl">
          {{ weather.icon }}
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white border-opacity-20">
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"></path>
          </svg>
          <span class="text-sm">湿度: {{ weather.humidity }}%</span>
        </div>
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
          <span class="text-sm">风速: {{ weather.windSpeed }}km/h</span>
        </div>
      </div>
      
      <div class="mt-3 pt-3 border-t border-white border-opacity-20">
        <button 
          @click="refreshWeather"
          :disabled="isLoading"
          class="w-full text-sm bg-white bg-opacity-20 hover:bg-opacity-30 rounded py-2 transition-colors disabled:opacity-50"
        >
          <span v-if="isLoading">加载中...</span>
          <span v-else>刷新天气</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeather } from '../composables/useWeather'

const { weather, lastUpdate, isLoading, error, fetchWeather, initWeather } = useWeather()

// 初始化天气
onMounted(() => {
  initWeather()
})

// 刷新天气
const refreshWeather = () => {
  fetchWeather()
}
</script>