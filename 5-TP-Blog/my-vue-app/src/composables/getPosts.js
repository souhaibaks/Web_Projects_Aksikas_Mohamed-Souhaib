import { ref } from 'vue'

export default function getPosts() {
    const posts = ref([])
    const error = ref(null)

    const load = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts')
            if (!response.ok) throw new Error('Could not fetch the data')
            posts.value = await response.json()
        } catch (err) {
            error.value = err.message
            console.log(error.value)
        }
    }

    return { posts, error, load }
}
