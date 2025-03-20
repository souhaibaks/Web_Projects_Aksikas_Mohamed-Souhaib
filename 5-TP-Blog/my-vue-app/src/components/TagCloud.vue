<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Tags</h5>
    </div>
    <div class="card-body">
      <div class="d-flex flex-wrap gap-2">
        <router-link
          v-for="tag in uniqueTags"
          :key="tag"
          :to="'/tags/' + tag"
          class="badge bg-primary text-decoration-none"
        >
          {{ tag }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagCloud',
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  computed: {
    uniqueTags() {
      const tags = new Set()
      this.posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style> 