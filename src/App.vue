<script setup lang="ts">
import { onMounted } from 'vue'
import Navigation from './components/Navigation.vue'

onMounted(() => {
  // 初始化应用
  console.log('湖北智能旅游应用已启动')
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navigation />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}
</style>
