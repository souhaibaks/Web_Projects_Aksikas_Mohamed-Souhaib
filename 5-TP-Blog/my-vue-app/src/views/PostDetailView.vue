<template>
  <div class="container">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else-if="post" class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h1 class="card-title">{{ post.title }}</h1>
            <div class="mb-3">
              <span v-for="tag in post.tags" :key="tag" class="badge bg-secondary me-1">
                {{ tag }}
              </span>
            </div>
            <p class="card-text">{{ post.body }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <TagCloud :posts="[post]" />
      </div>
    </div>
  </div>
</template>

<script>
import { useGetPost } from '../composables/getPost'
import TagCloud from '../components/TagCloud.vue'

export default {
  name: 'PostDetailView',
  components: {
    TagCloud
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const { post, loading, error } = useGetPost(props.id)
    return { post, loading, error }
  }
}
</script> 