<template>
    <div class="create-post">
        <h2>Créer un nouveau post</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label>Titre:</label>
                <input type="text" v-model="title" required>
            </div>
            
            <div class="form-group">
                <label>Contenu:</label>
                <textarea v-model="body" required></textarea>
            </div>
            
            <div class="form-group">
                <label>Tags (séparés par des virgules):</label>
                <input type="text" v-model="tagsInput" required>
            </div>
            
            <button type="submit">Publier</button>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const title = ref('')
        const body = ref('')
        const tagsInput = ref('')
        const router = useRouter()

        const handleSubmit = async () => {
            const tags = tagsInput.value.split(',').map(tag => tag.trim())
            const post = {
                title: title.value,
                body: body.value,
                tags
            }

            try {
                const res = await fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(post)
                })

                if (!res.ok) throw new Error('Erreur lors de la création du post')
                router.push('/')
            } catch (err) {
                console.log(err)
            }
        }

        return { title, body, tagsInput, handleSubmit }
    }
}
</script>

<style>
.create-post {
    width: 80%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

h2 {
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #333;
}

input, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
}

textarea {
    height: 150px;
}

button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    width: 100%;
}

button:hover {
    background-color: #45a049;
}
</style> 