<template>
  <div class="home">
    <div class="content">
      <PostList />
    </div>
    <aside class="sidebar">
      <TagCloud />
    </aside>
  </div>
</template>

<script>
import PostList from '../components/PostList.vue'
import TagCloud from '../components/TagCloud.vue'

export default {
  components: {
    PostList,
    TagCloud
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.content {
  min-width: 0;
}

.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

@media (max-width: 768px) {
  .home {
    grid-template-columns: 1fr;
  }
}
</style>
