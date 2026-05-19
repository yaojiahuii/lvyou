import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import './utils/initData'
import { initAuth } from './composables/useAuth'

// 导入页面组件
import Home from './views/Home.vue'
import Attractions from './views/Attractions.vue'
import AttractionDetail from './views/AttractionDetail.vue'
import Routes from './views/Routes.vue'
import RouteDetail from './views/RouteDetail.vue'
import Favorites from './views/Favorites.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import AIChat from './views/AIChat.vue'
import Admin from './views/Admin.vue'
import Profile from './views/Profile.vue'

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/attractions', name: 'Attractions', component: Attractions },
  { path: '/attractions/:id', name: 'AttractionDetail', component: AttractionDetail },
  { path: '/routes', name: 'Routes', component: Routes },
  { path: '/routes/:id', name: 'RouteDetail', component: RouteDetail },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/ai-chat', name: 'AIChat', component: AIChat },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/profile', name: 'Profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 初始化认证（在应用启动时加载持久化会话）
initAuth()

const app = createApp(App)
app.use(router)
app.mount('#app')
