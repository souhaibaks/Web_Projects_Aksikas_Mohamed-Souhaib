<template>
  <div class="home">
    <h1>Liste des offres d'emploi</h1>
    
    <div class="filters">
      <FilterNav @filter-change="handleFilterChange" />
    </div>

    <div class="job-grid">
      <JobDetail 
        v-for="job in filteredJobs" 
        :key="job.id" 
        :job="job"
        @delete="deleteJob"
      />
    </div>

    <router-link to="/add" class="add-button">
      Ajouter une offre
    </router-link>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { jobsStore } from '@/store/jobs'
import FilterNav from '@/components/FilterNav.vue'
import JobDetail from '@/components/JobDetail.vue'

export default {
  name: 'Home',
  components: {
    FilterNav,
    JobDetail
  },
  setup() {
    const filterCriteria = ref({
      searchTerm: '',
      sortBy: 'date'
    })

    const filteredJobs = computed(() => {
      let result = [...jobsStore.jobs]
      
      if (filterCriteria.value.searchTerm) {
        const search = filterCriteria.value.searchTerm.toLowerCase()
        result = result.filter(job => 
          job.titre.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search)
        )
      }

      if (filterCriteria.value.sortBy === 'date') {
        result.sort((a, b) => new Date(b['date de création']) - new Date(a['date de création']))
      } else if (filterCriteria.value.sortBy === 'salary') {
        result.sort((a, b) => parseInt(b.salaire) - parseInt(a.salaire))
      }

      return result
    })

    const handleFilterChange = (criteria) => {
      filterCriteria.value = criteria
    }

    const deleteJob = (id) => {
      jobsStore.deleteJob(id)
    }

    return {
      filteredJobs,
      handleFilterChange,
      deleteJob
    }
  }
}
</script>

<style>
body {
  background-color: #f0f2f5;
}

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5em;
  text-shadow: 2px 2px #ffd93d;
}

.filters {
  margin-bottom: 20px;
  background-color: white;
  padding: 15px;
  border: 2px solid #4ecdc4;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.add-button {
  display: block;
  width: 200px;
  margin: 20px auto;
  padding: 10px;
  background-color: #6c5ce7;
  color: white;
  text-align: center;
  text-decoration: none;
  border: 3px solid #a3a1ff;
  font-weight: bold;
  font-size: 1.1em;
}

.add-button:hover {
  background-color: #a3a1ff;
}

/* Pour les écrans plus petits */
@media (max-width: 900px) {
  .job-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .job-grid {
    grid-template-columns: 1fr;
  }
}
</style> 