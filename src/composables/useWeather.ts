import { ref } from 'vue'
import type { WeatherInfo } from '../types'

// 武汉的经纬度
const WUHAN_LAT = 30.5728
const WUHAN_LON = 114.277

// Open-Meteo API（免费，无需API Key）
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'

// 天气代码映射表
const weatherCodeMap: Record<number, { condition: string, icon: string }> = {
  0: { condition: '晴', icon: '☀️' },
  1: { condition: '晴', icon: '☀️' },
  2: { condition: '少云', icon: '🌤️' },
  3: { condition: '少云', icon: '🌤️' },
  45: { condition: '雾', icon: '🌫️' },
  48: { condition: '雾凇', icon: '🌫️' },
  51: { condition: '小雨', icon: '🌧️' },
  53: { condition: '中雨', icon: '🌧️' },
  55: { condition: '大雨', icon: '🌧️' },
  61: { condition: '小雨', icon: '🌧️' },
  63: { condition: '中雨', icon: '🌧️' },
  65: { condition: '大雨', icon: '🌧️' },
  71: { condition: '小雪', icon: '🌨️' },
  73: { condition: '中雪', icon: '🌨️' },
  75: { condition: '大雪', icon: '❄️' },
  80: { condition: '阵雨', icon: '🌦️' },
  81: { condition: '阵雨', icon: '🌦️' },
  82: { condition: '暴雨', icon: '⛈️' },
  95: { condition: '雷阵雨', icon: '⛈️' },
  96: { condition: '雷阵雨伴冰雹', icon: '⛈️' },
  99: { condition: '强雷阵雨伴冰雹', icon: '⛈️' }
}

export const useWeather = () => {
  const weather = ref<WeatherInfo>({
    temperature: 22,
    condition: '多云',
    humidity: 65,
    windSpeed: 12,
    icon: '☁️'
  })

  const isLoading = ref(false)
  const error = ref('')
  const lastUpdate = ref('')

  // 获取武汉天气
  const fetchWeather = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch(
        `${WEATHER_API_URL}?latitude=${WUHAN_LAT}&longitude=${WUHAN_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Shanghai`
      )

      if (!response.ok) {
        throw new Error('天气数据获取失败')
      }

      const data = await response.json()
      
      // 解析天气数据
      const current = data.current
      const weatherCode = current.weather_code
      const weatherInfo = weatherCodeMap[weatherCode] || { condition: '未知', icon: '🌤️' }

      weather.value = {
        temperature: Math.round(current.temperature_2m),
        condition: weatherInfo.condition,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        icon: weatherInfo.icon
      }

      const now = new Date()
      lastUpdate.value = `更新于 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

      // 缓存到 localStorage
      localStorage.setItem('wuhan_weather', JSON.stringify({
        weather: weather.value,
        lastUpdate: lastUpdate.value,
        timestamp: Date.now()
      }))

    } catch (err) {
      console.error('天气获取失败:', err)
      error.value = '天气数据获取失败，使用缓存数据'
      
      // 尝试使用缓存数据
      const cached = localStorage.getItem('wuhan_weather')
      if (cached) {
        const cacheData = JSON.parse(cached)
        const cacheAge = Date.now() - cacheData.timestamp
        // 缓存有效期2小时
        if (cacheAge < 2 * 60 * 60 * 1000) {
          weather.value = cacheData.weather
          lastUpdate.value = cacheData.lastUpdate
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  // 初始化
  const initWeather = () => {
    // 检查缓存
    const cached = localStorage.getItem('wuhan_weather')
    if (cached) {
      const cacheData = JSON.parse(cached)
      const cacheAge = Date.now() - cacheData.timestamp
      // 如果缓存少于30分钟，直接使用缓存
      if (cacheAge < 30 * 60 * 1000) {
        weather.value = cacheData.weather
        lastUpdate.value = cacheData.lastUpdate
        return
      }
    }
    
    // 否则获取新数据
    fetchWeather()
  }

  return {
    weather,
    lastUpdate,
    isLoading,
    error,
    fetchWeather,
    initWeather
  }
}