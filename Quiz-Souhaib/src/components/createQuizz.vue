<template>
    <div class="form-container">
        <div class="auth-form">
            <h1 class="form-title">Create a Quiz</h1>
            
            <!-- Quiz Creation Method Selection -->
            <div class="creation-method">
                <h3>Choose Quiz Creation Method</h3>
                <div class="method-options">
                    <button 
                        @click="setCreationMethod('api')" 
                        class="btn method-btn" 
                        :class="{'active': creationMethod === 'api'}"
                    >
                        Generate from Open Trivia DB
                    </button>
                    <button 
                        @click="setCreationMethod('manual')" 
                        class="btn method-btn" 
                        :class="{'active': creationMethod === 'manual'}"
                    >
                        Create Manually
                    </button>
                </div>
            </div>
            
            <form @submit.prevent="createQuizz">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" v-model="title" class="form-input" placeholder="Enter quiz title" required>
                </div>
                
                <!-- Manual Creation Fields -->
                <template v-if="creationMethod === 'manual'">
                    <div class="form-group">
                        <label for="topic">Topic</label>
                        <input type="text" v-model="topic" class="form-input" placeholder="Enter quiz topic">
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
                </template>
                
                <!-- API Generation Section -->
                <template v-if="creationMethod === 'api'">
                    <div class="trivia-section">
                        <h3>Generate Questions from Open Trivia DB</h3>
                        <OpenTriviaDB 
                            @questions-generated="handleQuestionsGenerated" 
                            @topic-selected="handleTopicSelected"
                            @difficulty-selected="handleDifficultySelected"
                        />
                    </div>
                </template>
                
                <!-- Questions Section -->
                <div v-if="creationMethod === 'manual' || questions.length > 0">
                    <div v-for="(question, index) in questions" :key="index" class="question-group">
                        <p class="instruction-text">If it is a true/false question, type true in option 1, false in option 2 and the correct answer in the correct answer field</p>
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
                    </div>
                    <div class="button-group" v-if="creationMethod === 'manual'">
                        <button @click="addQuestion" type="button" class="btn btn-secondary">Add Question</button>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-success" type="submit">Save Quiz</button>
                </div>
            </form>
            <router-link to="/" class="home-link">Back to Home</router-link>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue'
import {db} from '../firebase'
import {addDoc, collection} from 'firebase/firestore'
import OpenTriviaDB from './OpenTriviaDB.vue'
import { useRouter } from 'vue-router'

export default{
    components: {
        OpenTriviaDB
    },
    setup() {
        const questions = ref([])
        const title = ref("")
        const topic = ref("")
        const difficulty = ref(null)
        const creationMethod = ref('manual') // Default to manual creation
        const router = useRouter()

        const setCreationMethod = (method) => {
            creationMethod.value = method
            // Reset form when switching methods
            if (method === 'api') {
                topic.value = ""
                difficulty.value = null
                questions.value = []
            }
        }

        const addQuestion = () => {
            questions.value.push({
                question: "",
                options: ["", "", ""],
                correctAnswer: ""
            })
        }

        const handleQuestionsGenerated = (generatedQuestions) => {
            questions.value = generatedQuestions
        }

        const handleTopicSelected = (selectedTopic) => {
            topic.value = selectedTopic
        }

        const handleDifficultySelected = (selectedDifficulty) => {
            difficulty.value = selectedDifficulty
        }

        const createQuizz = async () => {
            if (!title.value) {
                alert('Please enter a quiz title')
                return
            }
            
            if (questions.value.length === 0) {
                alert('Please add at least one question or generate questions from the API')
                return
            }
            
            try {
                await addDoc(collection(db, 'Quizzes'), {
                    title: title.value,
                    topic: topic.value,
                    difficulty: difficulty.value,
                    questions: questions.value
                })
                
                // Redirect to home page after successful save
                router.push('/')
            } catch (error) {
                console.error("Error creating quiz:", error)
                alert('Error creating quiz. Please try again.')
            }
        }

        return {
            questions,
            title,
            topic,
            difficulty,
            creationMethod,
            setCreationMethod,
            addQuestion,
            handleQuestionsGenerated,
            handleTopicSelected,
            handleDifficultySelected,
            createQuizz
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

.creation-method {
    margin-bottom: 2rem;
    text-align: center;
}

.creation-method h3 {
    color: var(--secondary-color);
    margin-bottom: 1rem;
}

.method-options {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.method-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--primary-color);
    background-color: white;
    color: var(--primary-color);
    font-weight: 500;
    transition: all 0.3s ease;
}

.method-btn.active {
    background-color: var(--primary-color);
    color: white;
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

.instruction-text {
    color: #666;
    font-size: 0.9rem;
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
    justify-content: center;
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

@media (max-width: 768px) {
    .form-container {
        padding: 0 1rem;
    }
    
    .auth-form {
        padding: 1.5rem;
    }

    .method-options {
        flex-direction: column;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }

    .button-group {
        flex-direction: column;
    }
}
</style>