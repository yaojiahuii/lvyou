<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 英雄区域 -->
    <section class="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            探索湖北之美
          </h1>
          <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            发现湖北的壮丽山川、悠久历史和丰富文化，开启您的智能旅游之旅
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/attractions"
              class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              浏览景点
            </router-link>
            <router-link
              to="/routes"
              class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              规划路线
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色景点 -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">热门景点</h2>
          <p class="text-lg text-gray-600">探索湖北最受欢迎的旅游目的地</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="attraction in featuredAttractions"
            :key="attraction.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="relative">
              <img
                :src="attraction.images[0]"
                :alt="attraction.name"
                class="w-full h-48 object-cover"
              >
              <div class="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm font-semibold">
                {{ attraction.rating }}⭐
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ attraction.name }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ attraction.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-blue-600 font-semibold">
                  {{ attraction.price === 0 ? '免费' : `¥${attraction.price}` }}
                </span>
                <router-link
                  :to="`/attractions/${attraction.id}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  查看详情 →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐路线 -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">推荐路线</h2>
          <p class="text-lg text-gray-600">精心设计的旅游路线，让您的湖北之旅更加精彩</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="route in featuredRoutes"
            :key="route.id"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ route.name }}</h3>
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ route.difficulty === 'easy' ? '简单' : route.difficulty === 'medium' ? '中等' : '困难' }}
              </span>
            </div>
            <p class="text-gray-600 mb-4">{{ route.description }}</p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>⏱️ {{ route.duration }}</span>
              <span v-if="route.distance > 0">📍 {{ route.distance }}km</span>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in route.tags"
                :key="tag"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
            <router-link
              :to="`/routes/${route.id}`"
              class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看路线
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 天气信息 -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">实时天气</h2>
          <p class="text-lg text-gray-600">了解湖北主要城市的天气情况</p>
        </div>
        
        <div class="max-w-md mx-auto">
          <WeatherWidget />
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="py-16 bg-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">湖北旅游数据</h2>
          <p class="text-lg opacity-90">用数据了解湖北旅游的魅力</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">{{ attractions.length }}+</div>
            <div class="text-lg opacity-90">精选景点</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">17</div>
            <div class="text-lg opacity-90">地级市</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">5A</div>
            <div class="text-lg opacity-90">5A级景区</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold mb-2">365</div>
            <div class="text-lg opacity-90">全年开放</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { attractions, routes } from '../data/attractions'
import WeatherWidget from '../components/WeatherWidget.vue'

// 精选景点（评分最高的前3个）
const featuredAttractions = computed(() => 
  attractions
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
)

// 精选路线（前2个）
const featuredRoutes = computed(() => routes.slice(0, 2))
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
