import { ref } from 'vue'

const getPosts = () => {
    const posts = ref([])
    const error = ref(null)

    const load = async () => {
        try {
            error.value = null // Reset error before fetching
            const response = await fetch('http://localhost:3000/posts')
            
            if (!response.ok) {
                throw Error('Could not fetch posts. Is the JSON server running?')
            }
            
            posts.value = await response.json()
        } catch (err) {
            error.value = err.message
            console.error('Error fetching posts:', err)
        }
    }

    return { posts, error, load }
}

export default getPosts 