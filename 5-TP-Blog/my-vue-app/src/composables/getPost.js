import { ref, onMounted } from 'vue'

export function useGetPost(id) {
  const post = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchPost = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      const data = await response.json()
      // Transform the data to include tags (for demo purposes)
      post.value = {
        ...data,
        tags: ['vue', 'javascript', 'web'] // Demo tags
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPost()
  })

  return {
    post,
    loading,
    error,
    fetchPost
  }
} 