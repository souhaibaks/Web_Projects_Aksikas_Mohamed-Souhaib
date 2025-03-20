<template>
  <div class="edit-job">
    <h1>Modifier l'offre d'emploi</h1>
    
    <form v-if="jobData" @submit.prevent="handleSubmit" class="job-form">
      <div class="form-group">
        <label for="titre">Titre</label>
        <input 
          type="text" 
          id="titre" 
          v-model="jobData.titre" 
          required
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="jobData.description" 
          required
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="salaire">Salaire</label>
        <input 
          type="text" 
          id="salaire" 
          v-model="jobData.salaire" 
          required
        >
      </div>

      <div class="form-actions">
        <router-link to="/" class="cancel-button">Annuler</router-link>
        <button type="submit" class="submit-button">Enregistrer</button>
      </div>
    </form>

    <div v-else class="not-found">
      Offre d'emploi non trouvée.
      <router-link to="/">Retour à la liste</router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { jobsStore } from '@/store/jobs'

export default {
  name: 'EditJob',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const jobData = ref(null)

    onMounted(() => {
      const job = jobsStore.getJobById(parseInt(route.params.id))
      if (job) {
        jobData.value = { ...job }
      }
    })

    const handleSubmit = () => {
      if (jobData.value) {
        jobsStore.updateJob(jobData.value)
        router.push('/')
      }
    }

    return {
      jobData,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.edit-job {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.job-form {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.submit-button, .cancel-button {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  text-decoration: none;
}

.submit-button:hover {
  background-color: #3aa876;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.not-found {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.not-found a {
  display: block;
  margin-top: 20px;
  color: #42b983;
  text-decoration: none;
}

.not-found a:hover {
  text-decoration: underline;
}
</style> 