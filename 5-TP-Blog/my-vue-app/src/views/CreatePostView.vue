<template>
  <div class="create-post">
    <h2>Create New Post</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          type="text"
          id="title"
          v-model="title"
          required
        >
      </div>

      <div class="form-group">
        <label for="body">Content:</label>
        <textarea
          id="body"
          v-model="body"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma separated):</label>
        <input
          type="text"
          id="tags"
          v-model="tagsInput"
          placeholder="vue, javascript, web"
        >
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Creating...' : 'Create Post' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const title = ref('')
    const body = ref('')
    const tagsInput = ref('')
    const isSubmitting = ref(false)

    const handleSubmit = async () => {
      isSubmitting.value = true
      const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)

      try {
        const res = await fetch('http://localhost:3000/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.value,
            body: body.value,
            tags
          })
        })

        if (!res.ok) throw new Error('Could not create post')
        
        router.push('/')
      } catch (err) {
        console.error('Error creating post:', err)
        isSubmitting.value = false
      }
    }

    return {
      title,
      body,
      tagsInput,
      isSubmitting,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 200px;
  resize: vertical;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
