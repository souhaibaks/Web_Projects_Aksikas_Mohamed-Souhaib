<template>
    <div class="post-detail">
        <div v-if="error">{{ error }}</div>
        <div v-if="!post" class="loading">Loading post...</div>
        <div v-else class="content">
            <div class="post">
                <h2>{{ post.title }}</h2>
                <div class="tags">
                    <span v-for="tag in post.tags" :key="tag" class="tag">
                        <router-link :to="{ name: 'TagPosts', params: { tag }}">{{ tag }}</router-link>
                    </span>
                </div>
                <p class="body">{{ post.body }}</p>
            </div>
            <div class="sidebar">
                <TagCloud />
            </div>
        </div>
    </div>
</template>

<script>
import getPost from '../composables/getPost'
import TagCloud from '../components/TagCloud.vue'
import { useRoute } from 'vue-router'

export default {
    components: { TagCloud },
    setup() {
        const route = useRoute()
        const { post, error, load } = getPost(route.params.id)

        load()

        return { post, error }
    }
}
</script>

<style scoped>
.post-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.content {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-gap: 20px;
}
.post {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.tags {
    margin: 20px 0;
}
.tag {
    margin-right: 10px;
    padding: 4px 8px;
    border-radius: 20px;
    background: #e7f5ff;
    display: inline-block;
}
.tag a {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.9em;
}
.body {
    line-height: 1.6;
    margin-top: 20px;
}
.loading {
    text-align: center;
    padding: 20px;
}
@media (max-width: 768px) {
    .content {
        grid-template-columns: 1fr;
    }
}
</style> 