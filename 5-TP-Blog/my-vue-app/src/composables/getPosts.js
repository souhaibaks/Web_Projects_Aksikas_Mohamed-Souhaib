import { ref, onMounted } from 'vue'

export function useGetPosts() {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      // Transform the data to include tags (for demo purposes)
      posts.value = data.map(post => ({
        ...post,
        tags: ['vue', 'javascript', 'web'] // Demo tags
      }))
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPosts()
  })

  return {
    posts,
    loading,
    error,
    fetchPosts
  }
} 