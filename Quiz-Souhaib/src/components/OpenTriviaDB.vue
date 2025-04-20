<template>
  <div class="trivia-form">
    <div class="form-group">
      <label for="numQuestions">Number of Questions</label>
      <input 
        type="number" 
        v-model="numQuestions" 
        min="1" 
        max="50" 
        class="form-input" 
        placeholder="Enter number of questions (1-50)"
      >
    </div>
    <div class="form-group">
      <label for="topic">Topic</label>
      <select v-model="selectedTopic" class="form-input">
        <option value="">Any Topic</option>
        <option v-for="topic in topics" :key="topic.id" :value="topic.id">
          {{ topic.name }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label for="difficulty">Difficulty</label>
      <select v-model="difficulty" class="form-input">
        <option value="">Any Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
    <button @click="fetchQuestions" class="btn btn-primary" :disabled="isLoading">
      {{ isLoading ? 'Loading...' : 'Generate Questions' }}
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'OpenTriviaDB',
  emits: ['questionsGenerated', 'topicSelected', 'difficultySelected'],
  setup(props, { emit }) {
    const numQuestions = ref(10)
    const selectedTopic = ref('')
    const difficulty = ref('')
    const topics = ref([])
    const isLoading = ref(false)

    const fetchTopics = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php')
        const data = await response.json()
        topics.value = data.trivia_categories
      } catch (error) {
        console.error('Error fetching topics:', error)
      }
    }

    const fetchQuestions = async () => {
      if (!numQuestions.value || numQuestions.value < 1 || numQuestions.value > 50) {
        alert('Please enter a valid number of questions (1-50)')
        return
      }

      isLoading.value = true
      try {
        let url = `https://opentdb.com/api.php?amount=${numQuestions.value}`
        if (selectedTopic.value) url += `&category=${selectedTopic.value}`
        if (difficulty.value) url += `&difficulty=${difficulty.value}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          // Get the topic name from the first question
          const topicName = data.results[0].category
          
          // Map API difficulty to our format
          let mappedDifficulty = 'Medium'
          if (difficulty.value === 'easy') mappedDifficulty = 'Easy'
          else if (difficulty.value === 'hard') mappedDifficulty = 'Hard'
          
          // Emit the selected topic and difficulty
          emit('topicSelected', topicName)
          emit('difficultySelected', mappedDifficulty)
          
          const formattedQuestions = data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: q.correct_answer
          }))
          emit('questionsGenerated', formattedQuestions)
        } else {
          alert('Error fetching questions. Please try again.')
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        alert('Error fetching questions. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(fetchTopics)

    return {
      numQuestions,
      selectedTopic,
      difficulty,
      topics,
      isLoading,
      fetchQuestions
    }
  }
}
</script>

<style scoped>
.trivia-form {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 