import { ref } from 'vue'

const getPost = (id) => {
    const post = ref(null)
    const error = ref(null)

    const load = async () => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`)
            if (!response.ok) throw new Error('Could not fetch the post')
            post.value = await response.json()
        } catch (err) {
            error.value = err.message
            console.log(error.value)
        }
    }

    return { post, error, load }
}

export default getPost 