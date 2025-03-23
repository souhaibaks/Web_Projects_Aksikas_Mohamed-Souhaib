<template>
    <div class="tag-cloud">
        <h3>Tags</h3>
        <div class="tags">
            <router-link 
                v-for="tag in tags" 
                :key="tag"
                :to="{ name: 'TagPosts', params: { tag }}"
                class="tag"
            >
                {{ tag }}
            </router-link>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    setup() {
        const tags = ref([])
        const error = ref(null)

        const loadTags = async () => {
            try {
                const res = await fetch('http://localhost:3000/tags')
                if (!res.ok) throw new Error('Could not fetch tags')
                tags.value = await res.json()
            } catch (err) {
                error.value = err.message
                console.log(error.value)
            }
        }

        onMounted(loadTags)

        return { tags }
    }
}
</script>

<style scoped>
.tag-cloud {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.tags {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.tag {
    padding: 4px 8px;
    background: #e7f5ff;
    border-radius: 20px;
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.9em;
}
.tag:hover {
    background: #3b82f6;
    color: white;
}
h3 {
    color: #2c3e50;
    margin-bottom: 10px;
}
</style> 