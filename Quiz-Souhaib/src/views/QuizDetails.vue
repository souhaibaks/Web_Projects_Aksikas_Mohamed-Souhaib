<template>
  <div class="container">
    <div class="card">
      <h1 class="quiz-title">{{ title }}</h1>
      <div class="quiz-meta">
        <span class="meta-item">Topic: {{ topic }}</span>
        <span class="meta-item">Difficulty: {{ difficulty }}</span>
      </div>
    </div>

    <div v-if="!showResults" class="quiz-container">
      <div v-for="(question, index) in questions" :key="index">
        <div v-if="index === current_question" class="question-card">
          <h2 class="question-title">Question {{index+1}} of {{questions.length}}</h2>
          <p class="question-text">{{ question.question }}</p>
          
          <form @submit.prevent="submitAnswer(index)" class="answer-form">
            <div class="form-group">
              <div v-for="(option, i) in question.options" :key="i" 
                class="answer-option"
                :class="{
                  'correct': showFeedback && option === question.correctAnswer,
                  'incorrect': showFeedback && c_answer === option && option !== question.correctAnswer,
                  'selected': c_answer === option
                }">
                <label class="option-label">
                  <input 
                    type="radio" 
                    name="option" 
                    :value="option" 
                    v-model="c_answer"
                    class="option-input"
                    :disabled="showFeedback"
                  >
                  <span class="option-text">{{ option }}</span>
                </label>
              </div>
            </div>
            
            <div class="feedback-message" v-if="showFeedback">
              <p :class="isCorrect ? 'correct-message' : 'incorrect-message'">
                {{ isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${question.correctAnswer}` }}
              </p>
            </div>
            
            <div class="button-group">
              <button type="submit" class="btn" :disabled="!c_answer || showFeedback">Submit Answer</button>
              <button 
                type="button" 
                class="btn" 
                :class="isLastQuestion ? 'btn-success' : 'btn-secondary'"
                @click="isLastQuestion ? finishQuiz() : nextQuestion()" 
                :disabled="!showFeedback"
              >
                {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="results-container">
      <h2 class="results-title">Quiz Results</h2>
      <div class="score-container">
        <p class="score-text">Your Score: {{ correctAnswers }}/{{ questions.length }}</p>
        <p class="percentage">{{ Math.round((correctAnswers / questions.length) * 100) }}%</p>
        <div class="feedback-container" :class="performanceClass">
          <p class="feedback-message">{{ performanceFeedback }}</p>
          <p class="feedback-subtext">{{ performanceSubtext }}</p>
        </div>
      </div>
      <div class="button-group">
        <button @click="resetQuiz" class="btn btn-secondary">Try Again</button>
        <router-link to="/" class="btn btn-success">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, computed} from 'vue'
import { useRoute } from 'vue-router';
import {db, auth} from '../firebase'
import {getDoc, doc, addDoc, collection, updateDoc, setDoc} from 'firebase/firestore'

export default {
  setup() {
    const title = ref("")
    const topic = ref("")
    const difficulty = ref(null)
    const questions = ref([])
    const current_question = ref(0)
    const route = useRoute()
    const c_answer = ref(null)
    const ID = route.params.id
    const showFeedback = ref(false)
    const isCorrect = ref(false)
    const showResults = ref(false)
    const correctAnswers = ref(0)

    const isLastQuestion = computed(() => {
      return current_question.value === questions.value.length - 1
    })

    const get_data = async () => {
      const quiz = await getDoc(doc(db, 'Quizzes', ID))
      title.value = quiz.data().title
      topic.value = quiz.data().topic
      difficulty.value = quiz.data().difficulty
      questions.value = quiz.data().questions
    }

    const saveQuizResult = async () => {
      if (!auth.currentUser) return

      const percentage = (correctAnswers.value / questions.value.length) * 100
      
      // Save quiz result
      await addDoc(collection(db, 'quiz_results'), {
        userId: auth.currentUser.uid,
        quizId: ID,
        quizTitle: title.value,
        topic: topic.value,
        difficulty: difficulty.value,
        score: correctAnswers.value,
        totalQuestions: questions.value.length,
        percentage: percentage,
        timestamp: new Date(),
        displayName: auth.currentUser.displayName
      })

      // Get current user data
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)
      
      // Initialize user data if document doesn't exist
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email,
          totalScore: correctAnswers.value,
          quizzesTaken: 1,
          averageScore: percentage
        })
      } else {
        const userData = userDoc.data()
        
        // Calculate new average score
        const currentQuizzesTaken = userData.quizzesTaken || 0
        const currentAverageScore = userData.averageScore || 0
        
        const newQuizzesTaken = currentQuizzesTaken + 1
        const newAverageScore = currentQuizzesTaken === 0 
          ? percentage 
          : ((currentAverageScore * currentQuizzesTaken) + percentage) / newQuizzesTaken

        // Update user's scores
        await updateDoc(userRef, {
          totalScore: (userData.totalScore || 0) + correctAnswers.value,
          quizzesTaken: newQuizzesTaken,
          averageScore: newAverageScore
        })
      }
    }

    onMounted(get_data)

    const submitAnswer = (i) => {
      const q = questions.value[i]
      if (c_answer.value == null) {
        return
      }
      showFeedback.value = true
      isCorrect.value = c_answer.value === q.correctAnswer
      if (isCorrect.value) {
        correctAnswers.value++
      }
    }

    const nextQuestion = () => {
      current_question.value++
      c_answer.value = null
      showFeedback.value = false
      isCorrect.value = false
    }

    const finishQuiz = async () => {
      showResults.value = true
      await saveQuizResult()
    }

    const resetQuiz = () => {
      current_question.value = 0
      c_answer.value = null
      showFeedback.value = false
      isCorrect.value = false
      showResults.value = false
      correctAnswers.value = 0
    }

    const performanceClass = computed(() => {
      const percentage = (correctAnswers.value / questions.value.length) * 100
      if (percentage >= 90) return 'excellent'
      if (percentage >= 70) return 'good'
      if (percentage >= 50) return 'fair'
      return 'poor'
    })

    const performanceFeedback = computed(() => {
      const percentage = (correctAnswers.value / questions.value.length) * 100
      if (percentage >= 90) return 'Excellent Work! 🎉'
      if (percentage >= 70) return 'Good Job! 👍'
      if (percentage >= 50) return 'Not Bad! 😊'
      return 'Keep Practicing! 💪'
    })

    const performanceSubtext = computed(() => {
      const percentage = (correctAnswers.value / questions.value.length) * 100
      if (percentage >= 90) return 'You have mastered this topic!'
      if (percentage >= 70) return 'You have a good understanding of the material.'
      if (percentage >= 50) return 'You have a basic understanding, but there\'s room for improvement.'
      return 'Don\'t worry, practice makes perfect!'
    })

    return {
      title,
      topic,
      difficulty,
      questions,
      current_question, 
      c_answer,
      submitAnswer,
      nextQuestion,
      showFeedback,
      isCorrect,
      isLastQuestion,
      showResults,
      correctAnswers,
      finishQuiz,
      resetQuiz,
      performanceClass,
      performanceFeedback,
      performanceSubtext
    }
  }
}
</script>

<style scoped>
.quiz-title {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.quiz-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.meta-item {
  color: var(--text-color);
  font-size: 1.1rem;
}

.question-title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.answer-form {
  width: 100%;
}

.option-label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.option-input {
  margin-right: 1rem;
}

.option-text {
  flex: 1;
}

.answer-option {
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.answer-option:hover {
  border-color: var(--primary-color);
  background-color: #f8f9fa;
}

.answer-option.selected {
  border-color: var(--primary-color);
  background-color: #e3f2fd;
}

.answer-option.correct {
  border-color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
}

.answer-option.incorrect {
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.feedback-message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: var(--border-radius);
}

.correct-message {
  color: #2ecc71;
  font-weight: 600;
}

.incorrect-message {
  color: #e74c3c;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.results-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.results-title {
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.score-container {
  margin-bottom: 2rem;
}

.score-text {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.percentage {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-success {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.feedback-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  text-align: center;
}

.feedback-container.excellent {
  background-color: rgba(46, 204, 113, 0.1);
  border: 2px solid #2ecc71;
}

.feedback-container.good {
  background-color: rgba(52, 152, 219, 0.1);
  border: 2px solid #3498db;
}

.feedback-container.fair {
  background-color: rgba(241, 196, 15, 0.1);
  border: 2px solid #f1c40f;
}

.feedback-container.poor {
  background-color: rgba(231, 76, 60, 0.1);
  border: 2px solid #e74c3c;
}

.feedback-message {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.feedback-container.excellent .feedback-message {
  color: #2ecc71;
}

.feedback-container.good .feedback-message {
  color: #3498db;
}

.feedback-container.fair .feedback-message {
  color: #f1c40f;
}

.feedback-container.poor .feedback-message {
  color: #e74c3c;
}

.feedback-subtext {
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
  
  .quiz-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .results-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .feedback-message {
    font-size: 1.5rem;
  }
  
  .feedback-subtext {
    font-size: 1rem;
  }
}
</style> 