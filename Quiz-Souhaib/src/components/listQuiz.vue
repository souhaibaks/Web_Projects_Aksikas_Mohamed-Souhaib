<template>
<div class="quiz-list">
    <div class="list-header">
        <h1 class="list-title">List of Quizzes</h1>
        <router-link 
            v-if="isAdmin" 
            to="/CreateQuizz" 
            class="create-quiz-btn">
            Create New Quiz
        </router-link>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="['alert', `alert-${messageType}`]">
        {{ message }}
    </div>

    <div v-for="(quizz, index) in quizzes" :key="index" class="quiz-card">
        <router-link :to="{name:'quizdetail', params: {id:quizz.id}}" class="quiz-link">
            <div class="quiz-info">
                <h2 class="quiz-title">{{ quizz.title }}</h2>
                <p class="quiz-meta">Topic: {{ quizz.topic }}</p>
                <p class="quiz-meta">Difficulty: {{ quizz.difficulty }}</p>
            </div>
        </router-link>
        
        <div v-if="isAdmin" class="admin-actions">
            <button @click="editQuiz(quizz)" class="btn btn-edit" :disabled="isLoading">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button @click="confirmDelete(quizz)" class="btn btn-delete" :disabled="isLoading">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
        <div class="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{{ selectedQuiz?.title }}"?</p>
            <p class="warning">This action cannot be undone!</p>
            <div class="modal-actions">
                <button @click="deleteQuiz" class="btn btn-delete" :disabled="isLoading">
                    {{ isLoading ? 'Deleting...' : 'Delete' }}
                </button>
                <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import {db} from '../firebase'
import {collection, getDocs, deleteDoc, doc, getDoc} from 'firebase/firestore'
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default {
    setup() {
        const quizzes = ref([])
        const isAdmin = ref(false)
        const router = useRouter()
        const isLoading = ref(false)
        const message = ref('')
        const messageType = ref('success')
        const showDeleteModal = ref(false)
        const selectedQuiz = ref(null)

        const showMessage = (text, type = 'success') => {
            message.value = text
            messageType.value = type
            setTimeout(() => {
                message.value = ''
            }, 3000)
        }

        const get_quiz = async() => {
            try {
                isLoading.value = true
                const datas = await getDocs(collection(db, "Quizzes"))
                quizzes.value = []
                datas.forEach((doc) => {
                    quizzes.value.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            } catch (error) {
                showMessage('Error loading quizzes: ' + error.message, 'error')
            } finally {
                isLoading.value = false
            }
        }

        const checkAdminStatus = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                isAdmin.value = userDoc.data()?.admin ?? false
            } else {
                isAdmin.value = false
            }
        }

        const editQuiz = (quiz) => {
            router.push({ name: 'editQuiz', params: { id: quiz.id } })
        }

        const confirmDelete = (quiz) => {
            selectedQuiz.value = quiz
            showDeleteModal.value = true
        }

        const cancelDelete = () => {
            selectedQuiz.value = null
            showDeleteModal.value = false
        }

        const deleteQuiz = async () => {
            if (!selectedQuiz.value) return

            try {
                isLoading.value = true
                await deleteDoc(doc(db, "Quizzes", selectedQuiz.value.id))
                showMessage(`Quiz "${selectedQuiz.value.title}" has been deleted`)
                await get_quiz()
            } catch (error) {
                showMessage('Error deleting quiz: ' + error.message, 'error')
            } finally {
                isLoading.value = false
                showDeleteModal.value = false
                selectedQuiz.value = null
            }
        }

        onMounted(() => {
            get_quiz()
            onAuthStateChanged(auth, checkAdminStatus)
        })

        return {
            quizzes,
            isAdmin,
            editQuiz,
            deleteQuiz,
            isLoading,
            message,
            messageType,
            showDeleteModal,
            selectedQuiz,
            confirmDelete,
            cancelDelete
        }
    }
}
</script>

<style scoped>
.quiz-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.list-title {
    color: var(--primary-color);
    margin: 0;
}

.create-quiz-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: background-color 0.3s ease;
}

.create-quiz-btn:hover {
    background-color: var(--secondary-color);
}

.alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: var(--border-radius);
    text-align: center;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.quiz-card {
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    overflow: hidden;
}

.quiz-link {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
}

.quiz-info {
    margin-bottom: 1rem;
}

.quiz-title {
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
}

.quiz-meta {
    color: var(--text-color);
    margin: 0.25rem 0;
}

.admin-actions {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-top: 1px solid #eee;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn i {
    font-size: 1rem;
}

.btn-edit {
    background-color: #f1c40f;
    color: white;
}

.btn-delete {
    background-color: #e74c3c;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
}

.btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.icon {
    font-size: 1rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    max-width: 400px;
    width: 90%;
}

.modal-content h3 {
    color: var(--secondary-color);
    margin-bottom: 1rem;
}

.modal-content .warning {
    color: #e74c3c;
    margin: 1rem 0;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

@media (max-width: 768px) {
    .quiz-list {
        padding: 1rem;
    }

    .admin-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }

    .modal-content {
        margin: 1rem;
        padding: 1.5rem;
    }
}
</style>