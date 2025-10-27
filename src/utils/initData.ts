// 初始化演示数据
export const initDemoData = () => {
  // 检查是否已经初始化过
  if (localStorage.getItem('dataInitialized')) {
    return
  }

  // 创建演示用户
  const demoUsers = [
    {
      id: '1',
      name: '张三',
      email: 'demo@example.com',
      password: 'demo123',
      createdAt: new Date().toISOString(),
      favorites: {
        attractions: ['1', '2'],
        routes: ['1']
      }
    },
    {
      id: '2',
      name: '李四',
      email: 'user@example.com',
      password: 'user123',
      createdAt: new Date().toISOString(),
      favorites: {
        attractions: ['3'],
        routes: ['2']
      }
    }
  ]

  // 保存用户数据
  localStorage.setItem('users', JSON.stringify(demoUsers))

  // 标记数据已初始化
  localStorage.setItem('dataInitialized', 'true')
}

// 在应用启动时初始化数据
initDemoData()
