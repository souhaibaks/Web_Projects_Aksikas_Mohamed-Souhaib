<template>
  <div class="filter-nav">
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchTerm"
        placeholder="Rechercher un emploi..."
        @input="emitChange"
      >
    </div>
    
    <div class="sort-box">
      <select v-model="sortBy" @change="emitChange">
        <option value="date">Trier par date</option>
        <option value="salary">Trier par salaire</option>
      </select>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'FilterNav',
  emits: ['filter-change'],
  setup(props, { emit }) {
    const searchTerm = ref('')
    const sortBy = ref('date')

    const emitChange = () => {
      emit('filter-change', {
        searchTerm: searchTerm.value,
        sortBy: sortBy.value
      })
    }

    return {
      searchTerm,
      sortBy,
      emitChange
    }
  }
}
</script>

<style scoped>
.filter-nav {
  display: flex;
  gap: 20px;
  align-items: center;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.search-box {
  flex: 1;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #42b983;
}
</style> 