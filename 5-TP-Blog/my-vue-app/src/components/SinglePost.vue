<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ post.title }}</h5>
      <div class="mb-2">
        <span v-for="tag in post.tags" :key="tag" class="badge bg-secondary me-1">
          {{ tag }}
        </span>
      </div>
      <p class="card-text flex-grow-1">{{ snippet }}</p>
      <router-link :to="'/post/' + post.id" class="btn btn-primary mt-3">Read More</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SinglePost',
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
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style> 