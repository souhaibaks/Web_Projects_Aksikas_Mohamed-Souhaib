<template>
  <div class="container">
    <h1 class="mb-4">Create New Post</h1>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="form.title"
              required
            />
          </div>
          <div class="mb-3">
            <label for="body" class="form-label">Content</label>
            <textarea
              class="form-control"
              id="body"
              v-model="form.body"
              rows="5"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="tags" class="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              class="form-control"
              id="tags"
              v-model="form.tagsInput"
              placeholder="vue, javascript, web"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Create Post</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../composables/usePosts'

export default {
  name: 'CreatePostView',
  setup() {
    const router = useRouter()
    const { addPost } = usePosts()
    
    const form = ref({
      title: '',
      body: '',
      tagsInput: ''
    })

    const handleSubmit = () => {
      addPost(form.value)
      router.push('/')
    }

    return {
      form,
      handleSubmit
    }
  }
}
</script> 