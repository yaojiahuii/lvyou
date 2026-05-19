import { ref, computed } from 'vue'
import type { UserComment } from '../types'
import { ApiService } from '../services/api'

// 评论数据存储
const comments = ref<UserComment[]>([])
const isLoading = ref(false)

// 从后端加载评论数据
const loadComments = async (attractionId?: string) => {
  isLoading.value = true
  try {
    if (attractionId) {
      // 加载单个景点的评论
      const data = await ApiService.getReviewsByAttraction(attractionId)
      // 更新本地存储的该景点评论
      comments.value = comments.value.filter(c => c.attractionId !== attractionId)
      data.forEach((review: any) => {
        comments.value.push({
          id: review.id.toString(),
          attractionId: review.attraction_id.toString(),
          userId: review.user_id?.toString() || '',
          userName: review.user_name || '匿名用户',
          rating: review.rating || 5,
          comment: review.comment || '',
          createdAt: review.created_at || new Date().toISOString()
        })
      })
    }
  } catch (error) {
    console.error('加载评论数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 保存评论数据到localStorage（保留本地缓存）
const saveComments = () => {
  try {
    localStorage.setItem('attractionComments', JSON.stringify(comments.value))
  } catch (error) {
    console.error('保存评论数据失败:', error)
  }
}

// 获取景点的所有评论
const getAttractionComments = (attractionId: string): UserComment[] => {
  return comments.value
    .filter(comment => comment.attractionId === attractionId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// 添加新评论（提交到后端）
const addComment = async (
  attractionId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
): Promise<UserComment> => {
  try {
    // 调用后端API提交评论
    const response = await ApiService.addReview(attractionId, rating, comment)
    
    if (response.success) {
      const newComment: UserComment = {
        id: response.data.id.toString(),
        attractionId,
        userId,
        userName,
        rating,
        comment,
        createdAt: new Date().toISOString()
      }
      
      comments.value.push(newComment)
      saveComments()
      
      return newComment
    } else {
      throw new Error(response.message || '评论提交失败')
    }
  } catch (error) {
    console.error('提交评论失败:', error)
    throw error
  }
}

// 删除评论（仅管理员或评论者本人）
const deleteComment = async (commentId: string, userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    // 调用后端API删除评论
    const response = await ApiService.deleteReview(commentId)
    
    if (response.success) {
      const commentIndex = comments.value.findIndex(c => c.id === commentId)
      if (commentIndex !== -1) {
        comments.value.splice(commentIndex, 1)
        saveComments()
      }
      return true
    }
    return false
  } catch (error) {
    console.error('删除评论失败:', error)
    return false
  }
}

// 计算景点平均评分
const calculateAverageRating = (attractionId: string): number => {
  const attractionComments = getAttractionComments(attractionId)
  if (attractionComments.length === 0) return 0

  const sum = attractionComments.reduce((acc, comment) => acc + comment.rating, 0)
  return Math.round((sum / attractionComments.length) * 10) / 10
}

// 获取评论统计
const getCommentStats = (attractionId: string) => {
  const attractionComments = getAttractionComments(attractionId)

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  }

  attractionComments.forEach(comment => {
    ratingCounts[comment.rating as keyof typeof ratingCounts]++
  })

  return {
    total: attractionComments.length,
    average: calculateAverageRating(attractionId),
    ratingCounts
  }
}

// 获取用户的评论历史
const getUserComments = (userId: string): UserComment[] => {
  return comments.value
    .filter(comment => comment.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// 清除所有评论（仅管理员）
const clearAllComments = (): void => {
  comments.value = []
  localStorage.removeItem('attractionComments')
}

// 清除指定景点的评论（仅管理员）
const clearAttractionComments = (attractionId: string): void => {
  comments.value = comments.value.filter(comment => comment.attractionId !== attractionId)
  saveComments()
}

// 导出评论管理函数
export const useComments = () => {
  return {
    comments,
    isLoading,
    getAttractionComments,
    addComment,
    deleteComment,
    calculateAverageRating,
    getCommentStats,
    getUserComments,
    clearAllComments,
    clearAttractionComments,
    loadComments,
    saveComments
  }
}