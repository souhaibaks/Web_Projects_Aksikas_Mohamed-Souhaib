<template>
  <div class="tags-container">
    <h3 class="title">Tags</h3>
    <div class="tags-list">
      <router-link
        v-for="tag in allTags"
        :key="tag"
        :to="'/tags/' + tag"
        class="tag"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  computed: {
    allTags() {
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
.tags-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}

.title {
  margin: 0 0 1rem 0;
  color: #333;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #4CAF50;
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.tag:hover {
  background: #45a049;
}
</style> 