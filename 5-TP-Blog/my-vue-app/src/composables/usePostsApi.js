import { ref } from 'vue'

export function usePostsApi() {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const baseUrl = 'http://localhost:3000/posts'

  // Fetch all posts
  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(baseUrl)
      if (!response.ok) throw new Error('Failed to fetch posts')
      posts.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Add new post
  const addPost = async (post) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })
      if (!response.ok) throw new Error('Failed to add post')
      const newPost = await response.json()
      posts.value.push(newPost)
      return newPost
    } catch (err) {
      error.value = err.message
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Update post
  const updatePost = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update post')
      const updatedPost = await response.json()
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      return updatedPost
    } catch (err) {
      error.value = err.message
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  // Delete post
  const deletePost = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete post')
      posts.value = posts.value.filter(p => p.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    updatePost,
    deletePost
  }
} 