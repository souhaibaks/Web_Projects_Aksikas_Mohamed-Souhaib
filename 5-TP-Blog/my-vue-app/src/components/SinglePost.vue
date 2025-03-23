<template>
  <div class="post-card">
    <h3>{{ post.title }}</h3>
    <div class="snippet">{{ snippet }}</div>
    <div class="tags">
      <span v-for="tag in post.tags" :key="tag" class="tag">
        <router-link :to="{ path: `/tags/${tag}` }">{{ tag }}</router-link>
      </span>
    </div>
    <router-link :to="{ path: `/posts/${post.id}` }" class="read-more">
      Read More
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    snippet() {
      return this.post.body.substring(0, 50) + '...'
    }
  }
}
</script>

<style scoped>
.post-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}

.post-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.snippet {
  color: #666;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: #e7f1ff;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
}

.tag a {
  color: #007bff;
  text-decoration: none;
}

.read-more {
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}
</style>
