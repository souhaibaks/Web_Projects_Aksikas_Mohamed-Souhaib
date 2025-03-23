<template>
    <div class="home">
        <div class="main-content">
            <PostList />
        </div>
        <div class="sidebar">
            <TagCloud />
        </div>
    </div>
</template>

<script>
import PostList from '../components/PostList.vue'
import TagCloud from '../components/TagCloud.vue'

export default {
    name: 'Home',
    components: { PostList, TagCloud }
}
</script>

<style scoped>
.home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-gap: 20px;
}
@media (max-width: 768px) {
    .home {
        grid-template-columns: 1fr;
    }
}
</style> 