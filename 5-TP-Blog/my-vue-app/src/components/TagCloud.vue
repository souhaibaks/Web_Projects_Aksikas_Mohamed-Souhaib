<template>
  <div class="tag-cloud">
    <h3>Tags</h3>
    <div class="tags">
      <router-link
        v-for="tag in uniqueTags"
        :key="tag"
        :to="{ path: `/tags/${tag}` }"
        class="tag"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import getPosts from '../composables/getPosts'

export default {
  setup() {
    const { posts, load } = getPosts()

    load()

    const uniqueTags = computed(() => {
      const tags = posts.value.reduce((acc, post) => {
        return [...acc, ...post.tags]
      }, [])
      return [...new Set(tags)]
    })

    return { uniqueTags }
  }
}
</script>

<style scoped>
.tag-cloud {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tag-cloud h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e7f1ff;
  color: #007bff;
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #007bff;
  color: white;
}
</style>
