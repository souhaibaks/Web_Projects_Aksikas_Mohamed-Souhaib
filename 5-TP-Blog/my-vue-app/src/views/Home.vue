<template>
  <div class="container">
    <h1 class="mb-4">Blog Posts</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <PostList v-else :posts="posts" />
  </div>
</template>

<script>
import { usePosts } from '../composables/usePosts'
import PostList from '../components/PostList.vue'

export default {
  name: 'Home',
  components: {
    PostList
  },
  setup() {
    const { posts, loading, error } = usePosts()
    return { posts, loading, error }
  }
}
</script> 