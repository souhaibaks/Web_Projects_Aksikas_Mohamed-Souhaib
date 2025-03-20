<template>
  <div>
    <div class="job-card">
      <h2>{{ job.titre }}</h2>
      
      <div class="job-info">
        <p class="job-description">{{ job.description }}</p>
        <p class="job-salary"><b>Salaire:</b> {{ job.salaire }}</p>
        <p class="job-date"><b>Date:</b> {{ job['date de création'] }}</p>
      </div>

      <div class="buttons">
        <router-link :to="`/jobs/${job.id}`">
          <button class="edit-button">Modifier</button>
        </router-link>
        <button class="delete-button" @click="confirmDelete">Supprimer</button>
      </div>
    </div>

    <!-- Pop-up de confirmation -->
    <div v-if="showConfirmation" class="popup-overlay">
      <div class="popup-box">
        <h3>Attention!</h3>
        <p>Voulez-vous vraiment supprimer ce job?</p>
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelDelete">Non</button>
          <button class="confirm-button" @click="handleDelete">Oui</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'JobDetail',
  props: {
    job: {
      type: Object,
      required: true
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const showConfirmation = ref(false)

    const confirmDelete = () => {
      showConfirmation.value = true
    }

    const cancelDelete = () => {
      showConfirmation.value = false
    }

    const handleDelete = () => {
      emit('delete', props.job.id)
      showConfirmation.value = false
    }

    return {
      showConfirmation,
      confirmDelete,
      cancelDelete,
      handleDelete
    }
  }
}
</script>

<style>
.job-card {
  border: 3px solid #4ecdc4;
  border-radius: 10px;
  padding: 15px;
  background-color: white;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
}

h2 {
  color: #ff6b6b;
  margin-bottom: 15px;
  font-size: 1.5em;
  border-bottom: 2px dashed #ffd93d;
  padding-bottom: 5px;
}

.job-info {
  flex-grow: 1;
}

.job-description {
  color: #2d3436;
  margin-bottom: 15px;
  line-height: 1.4;
}

.job-salary {
  color: #6c5ce7;
  font-size: 1.1em;
  margin: 10px 0;
}

.job-date {
  color: #ff9f43;
}

.buttons {
  margin-top: 15px;
  text-align: center;
}

.edit-button {
  background-color: #4ecdc4;
  color: white;
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.delete-button {
  background-color: #ff6b6b;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-box {
  background-color: white;
  padding: 30px;
  border: 3px solid #ffd93d;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.popup-box h3 {
  color: #ff6b6b;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.popup-box p {
  color: #2d3436;
  font-size: 1.1em;
  margin-bottom: 20px;
}

.popup-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.confirm-button, .cancel-button {
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

.confirm-button {
  background-color: #ff6b6b;
  color: white;
}

.cancel-button {
  background-color: #4ecdc4;
  color: white;
}

.confirm-button:hover {
  background-color: #ff5252;
  transform: scale(1.05);
}

.cancel-button:hover {
  background-color: #45b8b0;
  transform: scale(1.05);
}
</style> 