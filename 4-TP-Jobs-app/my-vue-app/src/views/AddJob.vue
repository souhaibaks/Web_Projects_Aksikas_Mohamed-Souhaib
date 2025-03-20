<template>
  <div class="add-job">
    <h1>Ajouter une offre d'emploi</h1>
    
    <form @submit.prevent="handleSubmit" class="job-form">
      <div class="form-group">
        <label for="titre">Titre du poste</label>
        <input 
          type="text" 
          id="titre" 
          v-model="jobData.titre" 
          required
          placeholder="Ex: Développeur Web"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="jobData.description" 
          required
          rows="4"
          placeholder="Décrivez le poste et ses responsabilités"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="salaire">Salaire</label>
        <input 
          type="text" 
          id="salaire" 
          v-model="jobData.salaire" 
          required
          placeholder="Ex: 45 000 MAD/an"
        >
      </div>

      <div class="form-buttons">
        <router-link to="/" class="cancel-btn">Annuler</router-link>
        <button type="submit" class="submit-btn">Ajouter l'offre</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jobsStore } from '@/store/jobs'

export default {
  name: 'AddJob',
  setup() {
    const router = useRouter()
    const jobData = ref({
      titre: '',
      description: '',
      salaire: '',
      'date de création': new Date().toISOString().split('T')[0]
    })

    const handleSubmit = () => {
      jobsStore.addJob(jobData.value)
      router.push('/')
    }

    return {
      jobData,
      handleSubmit
    }
  }
}
</script>

<style>
.add-job {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-shadow: 2px 2px #ffd93d;
}

.job-form {
  background-color: white;
  padding: 30px;
  border: 3px solid #4ecdc4;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #6c5ce7;
  font-weight: bold;
  font-size: 1.1em;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #4ecdc4;
  border-radius: 5px;
  font-size: 16px;
  color: #2d3436;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.form-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.submit-btn, .cancel-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

.submit-btn {
  background-color: #4ecdc4;
  color: white;
}

.cancel-btn {
  background-color: #ff6b6b;
  color: white;
}

.submit-btn:hover {
  background-color: #45b8b0;
}

.cancel-btn:hover {
  background-color: #ff5252;
}

::placeholder {
  color: #b2bec3;
}
</style> 