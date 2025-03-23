<template>
  <div class="post-list">
    <div v-if="error">{{ error }}</div>
    <div v-if="posts.length === 0">Loading posts...</div>
    <div v-else class="posts-grid">
      <SinglePost
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script>
import SinglePost from './SinglePost.vue'
import getPosts from '../composables/getPosts'

export default {
  components: { SinglePost },
  setup() {
    const { posts, error, load } = getPosts()

    load()

    return { posts, error }
  }
}
</script>

<style scoped>
.post-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.posts-grid {
  display: grid;
  gap: 2rem;
}
</style>
