<template>
  <div class="row">
    <div class="col-md-8">
      <div v-if="posts.length === 0" class="text-center">
        <p>No posts found</p>
      </div>
      <div v-else class="row">
        <div v-for="post in posts" :key="post.id" class="col-md-6 mb-4">
          <PostCard :post="post" />
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <Tags :posts="posts" />
    </div>
  </div>
</template>

<script>
import PostCard from './PostCard.vue'
import Tags from './Tags.vue'

export default {
  name: 'PostList',
  components: {
    PostCard,
    Tags
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
}
</script> 