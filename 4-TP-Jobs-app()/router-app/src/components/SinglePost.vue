<template>
    <div class="post">
        <h3>{{ post.title }}</h3>
        <p class="preview">{{ snippet }}</p>
        <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">
                #{{ tag }}
            </span>
        </div>
        <router-link :to="{ name: 'PostDetail', params: { id: post.id }}" class="read-more">
            Lire la suite...
        </router-link>
    </div>
</template>

<script>
export default {
    props: ['post'],
    computed: {
        snippet() {
            return this.post.body.substring(0, 50) + '...'
        }
    }
}
</script>

<style>
.post {
    border: 1px solid #ddd;
    margin: 10px 0;
    padding: 15px;
    background-color: white;
}

.preview {
    color: #666;
    margin: 10px 0;
}

.tags {
    margin: 10px 0;
}

.tag {
    background-color: #e8e8e8;
    padding: 3px 8px;
    margin-right: 5px;
    font-size: 14px;
}

.read-more {
    color: blue;
    text-decoration: none;
}

.read-more:hover {
    text-decoration: underline;
}
</style> 