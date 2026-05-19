<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">管理员面板</h1>
        <p class="mt-2 text-sm text-gray-600">管理用户、景点和系统设置</p>
      </div>

      <!-- 管理员功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 用户管理 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 class="ml-4 text-lg font-semibold text-gray-900">用户管理</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">查看和管理所有注册用户</p>
          <button 
            @click="showUserManagement = true"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            管理用户
          </button>
        </div>

        <!-- 景点管理 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="ml-4 text-lg font-semibold text-gray-900">景点管理</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">添加、编辑和删除景点信息</p>
          <button 
            @click="showAttractionManagement = true"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            管理景点
          </button>
        </div>

        <!-- 评论管理 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="ml-4 text-lg font-semibold text-gray-900">评论管理</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">查看和删除用户评论</p>
          <button 
            @click="openReviewManagement"
            class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            管理评论
          </button>
        </div>

        <!-- 系统统计 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="ml-4 text-lg font-semibold text-gray-900">系统统计</h3>
          </div>
          <p class="text-gray-600 text-sm mb-4">查看系统使用情况和统计数据</p>
          <button 
            @click="showStatistics = true"
            class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            查看统计
          </button>
        </div>
      </div>

      <!-- 用户管理模态框 -->
      <div v-if="showUserManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
          <div class="flex justify-between items-center p-6 border-b flex-shrink-0">
            <h3 class="text-xl font-semibold">用户管理</h3>
            <button @click="showUserManagement = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 min-h-0">
            <div class="mb-4">
              <input 
                v-model="userSearch"
                type="text" 
                placeholder="搜索用户..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          <span class="text-gray-600 text-xs font-medium">{{ user.name.charAt(0) }}</span>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-xs text-gray-500">ID: {{ user.id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs rounded-full',
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      ]">
                        {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs rounded-full',
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      ]">
                        {{ user.status === 'active' ? '正常' : '冻结' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="toggleUserRole(user)"
                        :class="[
                          'px-3 py-1 text-xs rounded',
                          user.role === 'admin' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        ]"
                      >
                        {{ user.role === 'admin' ? '设为用户' : '设为管理员' }}
                      </button>
                      <button 
                        @click="toggleUserStatus(user)"
                        :class="[
                          'ml-2 px-3 py-1 text-xs rounded',
                          user.status === 'active' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'
                        ]"
                      >
                        {{ user.status === 'active' ? '冻结' : '激活' }}
                      </button>
                      <button 
                        @click="openResetPasswordModal(user)"
                        class="ml-2 px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        重置密码
                      </button>
                      <button 
                        @click="handleDeleteUser(user)"
                        class="ml-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 重置密码模态框 -->
      <div v-if="showResetPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
        <div class="bg-white rounded-lg max-w-md w-full">
          <div class="bg-purple-600 text-white px-6 py-4 flex items-center justify-between">
            <h3 class="text-xl font-bold">重置用户密码</h3>
            <button @click="showResetPasswordModal = false" class="text-purple-200 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">
              为用户 <span class="font-semibold">{{ resetPasswordUser?.name }}</span> 设置新密码：
            </p>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">新密码（至少6位）</label>
              <input 
                v-model="newPassword"
                type="password" 
                placeholder="请输入新密码"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
              <input 
                v-model="confirmPassword"
                type="password" 
                placeholder="请再次输入新密码"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button @click="showResetPasswordModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              取消
            </button>
            <button @click="handleResetPassword"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              确认重置
            </button>
          </div>
        </div>
      </div>

      <!-- 景点管理模态框 -->
      <div v-if="showAttractionManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] flex flex-col">
          <div class="flex justify-between items-center p-6 border-b flex-shrink-0">
            <h3 class="text-xl font-semibold">景点管理</h3>
            <button @click="showAttractionManagement = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 min-h-0">
            <div class="mb-4 flex justify-between items-center">
              <input 
                v-model="attractionSearch"
                type="text" 
                placeholder="搜索景点..."
                class="flex-1 mr-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
              <button 
                @click="openAddAttractionForm()"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                添加景点
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="attraction in filteredAttractions" :key="attraction.id" class="bg-gray-50 rounded-lg p-4">
                <div class="relative">
                  <img :src="attraction.images?.[0] || attraction.image_url || 'https://via.placeholder.com/300x200'" :alt="attraction.name" class="w-full h-32 object-cover rounded mb-3">
                  <span :class="[
                    'absolute top-2 right-2 px-2 py-1 text-xs rounded',
                    attraction.status === 'open' ? 'bg-green-500 text-white' : 
                    attraction.status === 'closed' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                  ]">
                    {{ attraction.status === 'open' ? '营业' : attraction.status === 'closed' ? '关闭' : '维护' }}
                  </span>
                </div>
                <h4 class="font-semibold text-gray-900">{{ attraction.name }}</h4>
                <p class="text-sm text-gray-600 mb-2">{{ attraction.city }} · {{ attraction.location || '未知位置' }}</p>
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm text-gray-700">¥{{ attraction.price || 0 }}</span>
                  <span class="text-sm text-yellow-600">★ {{ attraction.rating || 0 }}</span>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="openEditAttractionForm(attraction)"
                    class="flex-1 bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                  >
                    编辑
                  </button>
                  <button 
                    @click="handleDeleteAttraction(attraction)"
                    class="flex-1 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论管理模态框 -->
      <div v-if="showReviewManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-5xl w-full max-h-[80vh] flex flex-col">
          <div class="flex justify-between items-center p-6 border-b flex-shrink-0">
            <h3 class="text-xl font-semibold">评论管理</h3>
            <button @click="showReviewManagement = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 min-h-0">
            <div class="mb-4">
              <input 
                v-model="reviewSearch"
                type="text" 
                placeholder="搜索评论内容或用户名..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                @keyup.enter="reviewSearch = reviewSearch"
              >
            </div>
            <div v-if="loadingReviews" class="text-center py-8 text-gray-500">加载中...</div>
            <div v-else-if="filteredReviews.length === 0" class="text-center py-8 text-gray-500">暂无评论</div>
            <div v-else class="space-y-4">
              <div v-for="review in filteredReviews" :key="review.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span class="text-blue-600 text-xs font-medium">{{ review.user_name?.charAt(0) || 'U' }}</span>
                      </div>
                      <span class="font-medium text-gray-900">{{ review.user_name || '匿名用户' }}</span>
                      <span class="ml-2 text-yellow-500 text-sm">
                        <span v-for="i in 5" :key="i">
                          <svg class="w-4 h-4 inline" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </span>
                      </span>
                      <span class="ml-2 text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
                    </div>
                    <p class="text-gray-700 text-sm mb-2">{{ review.comment }}</p>
                    <p class="text-xs text-gray-500">景点：{{ review.attraction_name || `ID: ${review.attraction_id}` }}</p>
                  </div>
                  <button 
                    @click="handleDeleteReview(review.id)"
                    class="ml-4 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 景点添加/编辑表单模态框 -->
      <div v-if="showAttractionForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
        <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
          <div class="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
            <h3 class="text-xl font-bold">{{ editingAttraction ? '编辑景点' : '添加景点' }}</h3>
            <button @click="closeAttractionForm" class="text-green-200 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 基本信息 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">景点名称 *</label>
                <input v-model="attractionForm.name" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">城市 *</label>
                <select v-model="attractionForm.city" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">请选择城市</option>
                  <option value="武汉">武汉</option>
                  <option value="宜昌">宜昌</option>
                  <option value="襄阳">襄阳</option>
                  <option value="荆州">荆州</option>
                  <option value="十堰">十堰</option>
                  <option value="恩施">恩施</option>
                  <option value="黄石">黄石</option>
                  <option value="咸宁">咸宁</option>
                  <option value="荆门">荆门</option>
                  <option value="孝感">孝感</option>
                  <option value="黄冈">黄冈</option>
                  <option value="随州">随州</option>
                  <option value="鄂州">鄂州</option>
                  <option value="天门">天门</option>
                  <option value="仙桃">仙桃</option>
                  <option value="潜江">潜江</option>
                  <option value="神农架">神农架</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">位置/区域</label>
                <input v-model="attractionForm.location" type="text" placeholder="如：武昌区"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">价格（元）</label>
                <input v-model.number="attractionForm.price" type="number" min="0" placeholder="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select v-model="attractionForm.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="open">营业中</option>
                  <option value="closed">已关闭</option>
                  <option value="maintenance">维护中</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <input v-model="attractionForm.category" type="text" placeholder="如：自然风光"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">基础热度值</label>
                <input v-model.number="attractionForm.base_popularity" type="number" min="0" placeholder="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
                <div class="flex gap-2">
                  <input v-model="attractionForm.image_url" type="url" placeholder="https://..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <label class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <span>上传图片</span>
                    <input type="file" accept="image/*" @change="handleCoverUpload" class="hidden">
                  </label>
                </div>
                <p v-if="uploadingCover" class="text-sm text-blue-600 mt-1">上传中...</p>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">景点描述</label>
                <textarea v-model="attractionForm.description" rows="3" placeholder="请输入景点描述..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">营业时间</label>
                <input v-model="attractionForm.opening_hours" type="text" placeholder="如：09:00-18:00"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input v-model="attractionForm.contact_phone" type="tel" placeholder="如：0712-1234567"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">建议游览时长</label>
                <input v-model="attractionForm.recommended_duration" type="text" placeholder="如：2-3小时"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">最佳游玩季节</label>
                <input v-model="attractionForm.best_time_to_visit" type="text" placeholder="如：春季、秋季"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
                <input v-model="attractionForm.address" type="text" placeholder="请输入详细地址"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">经度</label>
                <input v-model.number="attractionForm.latitude" type="number" step="0.0001" placeholder="如：114.3055"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">纬度</label>
                <input v-model.number="attractionForm.longitude" type="number" step="0.0001" placeholder="如：30.5931"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">多张图片URL（每行一个）</label>
                <textarea v-model="imagesInput" rows="3" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                <input v-model="tagsInput" type="text" placeholder="如：5A景区,避暑,亲子"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">特色（逗号分隔）</label>
                <input v-model="featuresInput" type="text" placeholder="如：自然风光,历史古迹"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button @click="closeAttractionForm"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              取消
            </button>
            <button @click="saveAttraction"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {{ editingAttraction ? '保存修改' : '添加景点' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 系统统计模态框 -->
      <div v-if="showStatistics" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] flex flex-col">
          <div class="flex justify-between items-center p-6 border-b flex-shrink-0">
            <h3 class="text-xl font-semibold">系统统计</h3>
            <button @click="showStatistics = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 min-h-0">
            <!-- 统计卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 mb-2">总用户数</h4>
                <p class="text-2xl font-bold text-blue-600">{{ statistics.totalUsers }}</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 mb-2">总景点数</h4>
                <p class="text-2xl font-bold text-green-600">{{ statistics.totalAttractions }}</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 mb-2">总路线数</h4>
                <p class="text-2xl font-bold text-purple-600">{{ statistics.totalRoutes }}</p>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-600 mb-2">管理员数</h4>
                <p class="text-2xl font-bold text-orange-600">{{ statistics.totalAdmins }}</p>
              </div>
            </div>

            <!-- 图表区域 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- 用户增长 -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">用户角色分布</h4>
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-600">普通用户</span>
                      <span class="font-medium">{{ statistics.totalUsers - statistics.totalAdmins }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full" 
                        :style="{ width: ((statistics.totalUsers - statistics.totalAdmins) / statistics.totalUsers * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-gray-600">管理员</span>
                      <span class="font-medium">{{ statistics.totalAdmins }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-purple-600 h-2 rounded-full" 
                        :style="{ width: (statistics.totalAdmins / statistics.totalUsers * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 热门景点 -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">热门景点Top 5</h4>
                  <button
                    @click="openPopularityManagement"
                    class="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    管理热度
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="(attraction, index) in topAttractions" :key="attraction.id" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mr-2">{{ index + 1 }}</span>
                      <span class="text-sm text-gray-700">{{ attraction.name }}</span>
                    </div>
                    <span class="text-sm text-gray-500">热度: {{ attraction.popularity }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 最近注册用户 -->
            <div class="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">最近注册用户</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="user in recentUsers" :key="user.id" class="bg-white rounded p-3 flex items-center">
                  <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span class="text-gray-600 font-medium">{{ user.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(user.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限提示 -->
      <div v-if="!isAdmin" class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              权限不足
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>您需要管理员权限才能访问此页面。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热度值管理模态框 -->
    <div v-if="showPopularityManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div class="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-bold">热度值管理</h3>
          <button @click="showPopularityManagement = false" class="text-blue-200 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div class="space-y-4">
            <div v-for="item in popularityData" :key="item.id" class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-1">{{ item.attraction?.name }}</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>当前热度: <span class="font-bold text-blue-600">{{ item.currentPopularity }}</span></div>
                    <div>基础热度: {{ item.basePopularity }}</div>
                    <div>浏览: {{ item.viewCount }}次</div>
                    <div>收藏: {{ item.favoriteCount }}次</div>
                    <div>评论: {{ item.commentCount }}条</div>
                  </div>
                </div>
                <div class="flex flex-col items-end space-y-2 ml-4">
                  <button
                    @click="selectedAttractionForPopularity = item.attraction; newPopularityValue = item.basePopularity"
                    class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    调整热度
                  </button>
                  <button
                    @click="handleResetPopularity(item.id)"
                    class="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热度调整对话框 -->
        <div v-if="selectedAttractionForPopularity" class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex-1 mr-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                调整 {{ selectedAttractionForPopularity.name }} 的基础热度值
              </label>
              <input
                v-model.number="newPopularityValue"
                type="number"
                min="0"
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="flex space-x-2">
              <button
                @click="selectedAttractionForPopularity = null"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
              <button
                @click="handleAdjustPopularity"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { usePopularity } from '../composables/usePopularity'
import { useAdmin } from '../composables/useAdmin'
import { ApiService } from '../services/api'

const { isAdmin } = useAuth()
const { loadAttractions, getAttractionPopularity, adminAdjustPopularity, getAllPopularityData, loadPopularityData } = usePopularity()
const { users, loadUsers, updateUserRole, updateUserStatus, deleteUser, loadStatistics } = useAdmin()

// 状态管理
const showUserManagement = ref(false)
const showAttractionManagement = ref(false)
const showStatistics = ref(false)
const showPopularityManagement = ref(false)
const showAttractionForm = ref(false)
const showResetPasswordModal = ref(false)
const showReviewManagement = ref(false)
const userSearch = ref('')
const attractionSearch = ref('')
const reviewSearch = ref('')
const attractions = ref<any[]>([])
const isLoading = ref(true)

// 评论相关
const allReviews = ref<any[]>([])
const loadingReviews = ref(false)

// 重置密码相关
const resetPasswordUser = ref<any>(null)
const newPassword = ref('')
const confirmPassword = ref('')

// 景点表单数据
const editingAttraction = ref<any>(null)
const attractionForm = ref({
  name: '',
  description: '',
  image_url: '',
  city: '',
  location: '',
  address: '',
  latitude: 0,
  longitude: 0,
  price: 0,
  opening_hours: '',
  contact_phone: '',
  category: '',
  status: 'open',
  base_popularity: 10,
  recommended_duration: '',
  best_time_to_visit: ''
})
const imagesInput = ref('')
const tagsInput = ref('')
const featuresInput = ref('')
const uploadingCover = ref(false)

// 统计数据
const statistics = computed(() => {
  const totalUsers = users.value.length
  const totalAdmins = users.value.filter(u => u.role === 'admin').length
  return {
    totalUsers,
    totalAdmins,
    totalAttractions: attractions.value.length,
    totalRoutes: 0 // 路线数据暂时为0
  }
})

// 热门景点
const topAttractions = computed(() => {
  return [...attractions.value]
    .map(attraction => ({
      ...attraction,
      // 尝试从热度数据获取，否则使用景点本身的 popularity 字段
      popularity: getAttractionPopularity(attraction.id.toString()) || 
                  (attraction as any).calculated_popularity ||
                  (attraction as any).calculatedPopularity ||
                  (attraction as any).popularity ||
                  0
    }))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 5)
})

// 最近注册用户
const recentUsers = computed(() => {
  return [...users.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
})

// 热度值管理
const popularityData = ref<any[]>([])
const selectedAttractionForPopularity = ref<any>(null)
const newPopularityValue = ref(0)

// 加载热度数据
const loadPopularityDataForManagement = () => {
  console.log('📊 加载热度数据 for management...')
  console.log('📊 getAllPopularityData():', getAllPopularityData())
  popularityData.value = getAllPopularityData().map(data => ({
    ...data,
    attraction: attractions.value.find(a => a.id.toString() === data.id.toString())
  }))
  console.log('📊 popularityData:', popularityData.value)
}

// 管理员调整热度值
const handleAdjustPopularity = () => {
  if (selectedAttractionForPopularity.value) {
    adminAdjustPopularity(selectedAttractionForPopularity.value.id, newPopularityValue.value)
    loadPopularityDataForManagement()
    alert('热度值已更新')
  }
}

// 重置热度数据
const handleResetPopularity = (attractionId: string) => {
  if (confirm('确定要重置该景点的热度数据吗？')) {
    const attraction = attractions.value.find(a => a.id === attractionId)
    if (attraction) {
      adminAdjustPopularity(attractionId, attraction.popularity)
      loadPopularityDataForManagement()
      alert('热度数据已重置')
    }
  }
}

// 过滤用户
const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  return users.value.filter(user => 
    user.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.value.toLowerCase())
  )
})

// 过滤景点
const filteredAttractions = computed(() => {
  if (!attractionSearch.value) return attractions.value
  return attractions.value.filter(attraction => 
    attraction.name.toLowerCase().includes(attractionSearch.value.toLowerCase()) ||
    attraction.city.toLowerCase().includes(attractionSearch.value.toLowerCase())
  )
})

// 过滤评论
const filteredReviews = computed(() => {
  if (!reviewSearch.value) return allReviews.value
  const search = reviewSearch.value.toLowerCase()
  return allReviews.value.filter(review => 
    (review.comment?.toLowerCase().includes(search)) ||
    (review.user_name?.toLowerCase().includes(search))
  )
})

// 打开热度管理
const openPopularityManagement = () => {
  loadPopularityDataForManagement()
  showPopularityManagement.value = true
}

// 打开评论管理
const openReviewManagement = async () => {
  showReviewManagement.value = true
  loadingReviews.value = true
  try {
    allReviews.value = await ApiService.getAllReviews()
  } catch (error) {
    console.error('加载评论失败:', error)
    alert('加载评论失败')
  } finally {
    loadingReviews.value = false
  }
}

// 删除评论
const handleDeleteReview = async (reviewId: number) => {
  if (confirm('确定要删除这条评论吗？')) {
    try {
      const result = await ApiService.deleteReview(reviewId.toString())
      if (result.success) {
        alert('评论已删除')
        allReviews.value = allReviews.value.filter(r => r.id !== reviewId)
      } else {
        alert(result.message || '删除失败')
      }
    } catch (error: any) {
      alert(error.message || '删除失败')
    }
  }
}

// 切换用户角色
const toggleUserRole = async (user: any) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  const result = await updateUserRole(user.id.toString(), newRole)
  if (!result.success) {
    alert(result.error || '更新失败')
  }
}

// 切换用户状态
const toggleUserStatus = async (user: any) => {
  const newStatus = user.status === 'active' ? 'frozen' : 'active'
  const action = newStatus === 'frozen' ? '冻结' : '激活'
  
  if (confirm(`确定要${action}用户 ${user.name} 吗？`)) {
    const result = await updateUserStatus(user.id.toString(), newStatus)
    if (!result.success) {
      alert(result.error || '更新失败')
    }
  }
}

// 删除用户
const handleDeleteUser = async (user: any) => {
  if (confirm(`确定要删除用户 ${user.name} 吗？此操作不可撤销。`)) {
    const result = await deleteUser(user.id.toString())
    if (result.success) {
      alert('用户已删除')
    } else {
      alert(result.error || '删除失败')
    }
  }
}

// 打开重置密码模态框
const openResetPasswordModal = (user: any) => {
  resetPasswordUser.value = user
  newPassword.value = ''
  confirmPassword.value = ''
  showResetPasswordModal.value = true
}

// 处理重置密码
const handleResetPassword = async () => {
  if (!resetPasswordUser.value) return
  
  if (!newPassword.value || newPassword.value.length < 6) {
    alert('密码长度不能少于6位')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  
  try {
    const result = await ApiService.resetUserPassword(resetPasswordUser.value.id.toString(), newPassword.value)
    if (result.success) {
      alert('密码重置成功')
      showResetPasswordModal.value = false
    } else {
      alert(result.message || '密码重置失败')
    }
  } catch (error: any) {
    alert(error.message || '密码重置失败')
  }
}

// 打开添加景点表单
const openAddAttractionForm = () => {
  editingAttraction.value = null
  attractionForm.value = {
    name: '',
    description: '',
    image_url: '',
    city: '',
    location: '',
    address: '',
    latitude: 0,
    longitude: 0,
    price: 0,
    opening_hours: '',
    contact_phone: '',
    category: '',
    status: 'open',
    base_popularity: 10,
    recommended_duration: '',
    best_time_to_visit: ''
  }
  imagesInput.value = ''
  tagsInput.value = ''
  featuresInput.value = ''
  showAttractionForm.value = true
}

// 打开编辑景点表单
const openEditAttractionForm = (attraction: any) => {
  editingAttraction.value = attraction
  attractionForm.value = {
    name: attraction.name || '',
    description: attraction.description || '',
    image_url: attraction.image_url || '',
    city: attraction.city || '',
    location: attraction.location || '',
    address: attraction.address || '',
    latitude: attraction.latitude || 0,
    longitude: attraction.longitude || 0,
    price: attraction.price || 0,
    opening_hours: attraction.opening_hours || '',
    contact_phone: attraction.contact_phone || '',
    category: attraction.category || '',
    status: attraction.status || 'open',
    base_popularity: attraction.base_popularity || 10,
    recommended_duration: attraction.recommended_duration || '',
    best_time_to_visit: attraction.best_time_to_visit || ''
  }
  imagesInput.value = (attraction.images || []).join('\n')
  tagsInput.value = (attraction.tags || []).join(',')
  featuresInput.value = (attraction.features || []).join(',')
  showAttractionForm.value = true
}

// 关闭景点表单
const closeAttractionForm = () => {
  showAttractionForm.value = false
  editingAttraction.value = null
}

// 保存景点（添加或编辑）
const saveAttraction = async () => {
  if (!attractionForm.value.name || !attractionForm.value.city) {
    alert('请填写景点名称和城市')
    return
  }

  try {
    const data = {
      ...attractionForm.value,
      images: imagesInput.value.split('\n').filter((url: string) => url.trim()),
      tags: tagsInput.value.split(',').map((t: string) => t.trim()).filter((t: string) => t),
      features: featuresInput.value.split(',').map((f: string) => f.trim()).filter((f: string) => f)
    }

    if (editingAttraction.value) {
      // 编辑
      const result = await ApiService.updateAttraction(editingAttraction.value.id.toString(), data)
      if (result.success) {
        alert('景点更新成功')
        // 更新本地数据
        const index = attractions.value.findIndex(a => a.id === editingAttraction.value.id)
        if (index !== -1) {
          attractions.value[index] = { ...attractions.value[index], ...data }
        }
      } else {
        alert(result.message || '更新失败')
      }
    } else {
      // 添加
      const result = await ApiService.createAttraction(data)
      if (result.success) {
        alert('景点添加成功')
        // 重新加载景点列表
        attractions.value = await ApiService.getAllAttractions()
      } else {
        alert(result.message || '添加失败')
      }
    }
    closeAttractionForm()
  } catch (error: any) {
    alert(error.message || '操作失败')
  }
}

// 删除景点
const handleDeleteAttraction = async (attraction: any) => {
  if (confirm(`确定要删除景点 "${attraction.name}" 吗？此操作不可撤销。`)) {
    try {
      const result = await ApiService.deleteAttraction(attraction.id.toString())
      if (result.success) {
        alert('景点已删除')
        attractions.value = attractions.value.filter(a => a.id !== attraction.id)
      } else {
        alert(result.message || '删除失败')
      }
    } catch (error: any) {
      alert(error.message || '删除失败')
    }
  }
}

// 上传封面图片
const handleCoverUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  
  uploadingCover.value = true
  try {
    const result = await ApiService.uploadImage(input.files[0])
    if (result.success) {
      attractionForm.value.image_url = result.data.url
      alert('图片上传成功')
    } else {
      alert(result.message || '上传失败')
    }
  } catch (error: any) {
    alert(error.message || '上传失败')
  } finally {
    uploadingCover.value = false
    input.value = ''
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 组件挂载时加载数据
onMounted(async () => {
  isLoading.value = true
  try {
    // 从后端加载景点数据
    attractions.value = await loadAttractions()
    // 加载热度数据
    await loadPopularityData()
    // 加载用户数据（管理员权限）
    await loadUsers()
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
  }
})
</script>