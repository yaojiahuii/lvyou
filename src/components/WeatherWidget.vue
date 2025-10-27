<template>
  <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">武汉天气</h3>
        <div class="flex items-center space-x-2 mt-1">
          <span class="text-3xl font-bold">{{ weather.temperature }}°C</span>
          <div class="text-sm">
            <div>{{ weather.condition }}</div>
            <div>湿度: {{ weather.humidity }}%</div>
            <div>风速: {{ weather.windSpeed }}km/h</div>
          </div>
        </div>
      </div>
      <div class="text-4xl">
        {{ weather.icon }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { WeatherInfo } from '../types'

const weather = ref<WeatherInfo>({
  temperature: 22,
  condition: '多云',
  humidity: 65,
  windSpeed: 12,
  icon: '☁️'
})

// 模拟天气数据更新
onMounted(() => {
  const updateWeather = () => {
    const conditions = ['晴天', '多云', '小雨', '阴天']
    const icons = ['☀️', '☁️', '🌧️', '⛅']
    const randomIndex = Math.floor(Math.random() * conditions.length)
    
    weather.value = {
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30度
      condition: conditions[randomIndex],
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15km/h
      icon: icons[randomIndex]
    }
  }

  updateWeather()
  // 每30分钟更新一次天气
  setInterval(updateWeather, 30 * 60 * 1000)
})
</script>
