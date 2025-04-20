<template>
    <div class="form-container">
        <div class="auth-form">
            <h1 class="form-title">Edit Quiz</h1>
            <form @submit.prevent="updateQuiz">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" v-model="title" class="form-input" placeholder="Enter quiz title">
                </div>
                <div class="form-group">
                    <label for="topic">Topic</label>
                    <input type="text" v-model="topic" class="form-input" placeholder="Enter quiz topic" readonly>
                </div>
                <div class="form-group">
                    <label for="difficulty">Difficulty</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" value="Easy" v-model="difficulty">
                            Easy
                        </label>
                        <label class="radio-label">
                            <input type="radio" value="Medium" v-model="difficulty">
                            Medium
                        </label>
                        <label class="radio-label">
                            <input type="radio" value="Hard" v-model="difficulty">
                            Hard
                        </label>
                    </div>
                </div>

                <!-- Open Trivia DB Integration -->
                <div class="trivia-section">
                    <h3>Generate New Questions from Open Trivia DB</h3>
                    <OpenTriviaDB 
                        @questions-generated="handleQuestionsGenerated" 
                        @difficulty-selected="handleDifficultySelected"
                    />
                </div>

                <div v-for="(question, index) in questions" :key="index" class="question-group">
                    <h3 class="question-number">Question {{ index + 1 }}</h3>
                    <input type="text" v-model="question.question" class="form-input" placeholder="Enter a question">
                    <div class="options-grid">
                        <input
                            v-for="(option, oIndex) in question.options"
                            :key="oIndex"
                            type="text"
                            v-model="question.options[oIndex]"
                            :placeholder="`Option ${oIndex + 1}`"
                            class="form-input"
                        />
                    </div>
                    <input
                        type="text"
                        v-model="question.correctAnswer"
                        placeholder="Correct answer"
                        class="form-input"
                    />
                    <button type="button" @click="removeQuestion(index)" class="btn btn-delete">Remove Question</button>
                </div>
                <div class="button-group">
                    <button @click="addQuestion" type="button" class="btn btn-secondary">Add Question</button>
                    <button class="btn btn-success" type="submit">Save Changes</button>
                </div>
            </form>
            <router-link to="/" class="home-link">Back to Home</router-link>
        </div>
    </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {db} from '../firebase'
import {doc, getDoc, updateDoc} from 'firebase/firestore'
import {useRoute, useRouter} from 'vue-router'
import OpenTriviaDB from './OpenTriviaDB.vue'

export default {
    components: {
        OpenTriviaDB
    },
    setup() {
        const questions = ref([])
        const title = ref("")
        const topic = ref("")
        const difficulty = ref(null)
        const route = useRoute()
        const router = useRouter()
        const quizId = route.params.id

        const loadQuiz = async () => {
            const quizDoc = await getDoc(doc(db, 'Quizzes', quizId))
            if (quizDoc.exists()) {
                const data = quizDoc.data()
                title.value = data.title
                topic.value = data.topic
                difficulty.value = data.difficulty
                questions.value = data.questions
            }
        }

        const addQuestion = () => {
            questions.value.push({
                question: "",
                options: ["", "", ""],
                correctAnswer: ""
            })
        }

        const removeQuestion = (index) => {
            questions.value.splice(index, 1)
        }

        const handleQuestionsGenerated = (generatedQuestions) => {
            questions.value = generatedQuestions
        }

        const handleDifficultySelected = (selectedDifficulty) => {
            difficulty.value = selectedDifficulty
        }

        const updateQuiz = async () => {
            try {
                await updateDoc(doc(db, 'Quizzes', quizId), {
                    title: title.value,
                    topic: topic.value,
                    difficulty: difficulty.value,
                    questions: questions.value
                })
                router.push('/')
            } catch (error) {
                console.error("Error updating quiz:", error)
            }
        }

        onMounted(loadQuiz)

        return {
            questions,
            title,
            topic,
            difficulty,
            addQuestion,
            removeQuestion,
            handleQuestionsGenerated,
            handleDifficultySelected,
            updateQuiz
        }
    }
}
</script>

<style scoped>
.form-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.auth-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-title {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
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

.radio-group {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.question-group {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-radius: var(--border-radius);
}

.question-number {
    color: var(--secondary-color);
    margin-bottom: 1rem;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1rem 0;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
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

.btn-delete {
    background-color: #e74c3c;
    color: white;
    margin-top: 1rem;
}

.btn:hover {
    opacity: 0.9;
}

.home-link {
    display: inline-block;
    margin-top: 1rem;
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

.home-link:hover {
    color: var(--secondary-color);
}

@media (max-width: 768px) {
    .form-container {
        padding: 0 1rem;
    }
    
    .auth-form {
        padding: 1.5rem;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }

    .button-group {
        flex-direction: column;
    }
}

.trivia-section {
    margin: 2rem 0;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: var(--border-radius);
}

.trivia-section h3 {
    color: var(--secondary-color);
    margin-bottom: 1rem;
}
</style> 