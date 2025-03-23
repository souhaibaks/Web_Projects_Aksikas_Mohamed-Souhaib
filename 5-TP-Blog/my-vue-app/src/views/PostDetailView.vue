<template>
  <div class="post-detail">
    <div class="content">
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="!post" class="loading">Loading post...</div>
      <article v-else>
        <h1>{{ post.title }}</h1>
        <div class="tags">
          <router-link
            v-for="tag in post.tags"
            :key="tag"
            :to="{ path: `/tags/${tag}` }"
            class="tag"
          >
            {{ tag }}
          </router-link>
        </div>
        <div class="body">{{ post.body }}</div>
      </article>
    </div>
    <aside class="sidebar">
      <TagCloud />
    </aside>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import getPost from '../composables/getPost'
import TagCloud from '../components/TagCloud.vue'

export default {
  components: {
    TagCloud
  },
  setup() {
    const route = useRoute()
    const { post, error, load } = getPost(route.params.id)

    onMounted(load)

    return { post, error }
  }
}
</script>

<style scoped>
.post-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

.body {
  line-height: 1.6;
  color: #444;
}

.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.error {
  color: #dc3545;
  padding: 1rem;
  background: #f8d7da;
  border-radius: 4px;
}

.loading {
  text-align: center;
  color: #666;
  padding: 2rem;
}

@media (max-width: 768px) {
  .post-detail {
    grid-template-columns: 1fr;
  }
}
</style>
