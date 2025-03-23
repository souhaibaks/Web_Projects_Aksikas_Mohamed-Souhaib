<template>
    <div class="post-list">
        <div v-if="error" class="error">
            <p>{{ error }}</p>
            <button @click="load">Réessayer</button>
        </div>
        <div v-else-if="posts.length === 0" class="loading">
            <p>Chargement des articles...</p>
        </div>
        <div v-else>
            <SinglePost v-for="post in posts" :key="post.id" :post="post" />
        </div>
    </div>
</template>

<script>
import SinglePost from './SinglePost.vue'
import getPosts from '../composables/getPosts'

export default {
    name: 'PostList',
    components: { SinglePost },
    setup() {
        const { posts, error, load } = getPosts()
        load()
        return { posts, error, load }
    }
}
</script>

<style>
.post-list {
    width: 80%;
    margin: 20px auto;
}

.error {
    background-color: #ffcccc;
    padding: 10px;
    margin: 10px;
    text-align: center;
}

.error button {
    background-color: #ff0000;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

.loading {
    text-align: center;
    color: gray;
}
</style> 