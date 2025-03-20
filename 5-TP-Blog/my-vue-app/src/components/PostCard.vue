<template>
  <div class="card">
    <div class="card-content">
      <h3 class="title">{{ post.title }}</h3>
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
      <p class="text">{{ shortText }}</p>
      <router-link :to="'/post/' + post.id" class="button">Read More</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    shortText() {
      return this.post.body.substring(0, 50) + '...'
    }
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.card-content {
  padding: 1rem;
}

.title {
  margin: 0 0 1rem 0;
  color: #333;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #4CAF50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.text {
  color: #666;
  margin-bottom: 1rem;
}

.button {
  display: inline-block;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.button:hover {
  background: #45a049;
}
</style> 