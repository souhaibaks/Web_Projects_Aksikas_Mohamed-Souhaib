<template>
    <div class="profile-container">
        <div class="profile-card">
            <div class="profile-header">
                <h1 class="profile-title">Profile</h1>
                <div class="user-info">
                    <h2>{{ user && user.displayName }}</h2>
                    <p>{{ user && user.email }}</p>
                </div>
            </div>

            <div class="quiz-history">
                <h2 class="section-title">Quiz History</h2>
                <div v-if="quizHistory.length > 0" class="history-list">
                    <div v-for="(result, index) in quizHistory" :key="index" class="history-item">
                        <div class="quiz-info">
                            <h3>{{ result.quizTitle }}</h3>
                            <p class="quiz-meta">
                                <span>Topic: {{ result.topic }}</span>
                                <span>Difficulty: {{ result.difficulty }}</span>
                            </p>
                        </div>
                        <div class="score-info">
                            <div class="score">
                                {{ result.score }}/{{ result.totalQuestions }}
                                ({{ Math.round((result.score / result.totalQuestions) * 100) }}%)
                            </div>
                            <div class="date">
                                {{ new Date(result.timestamp).toLocaleDateString() }}
                            </div>
                        </div>
                        <div class="performance" :class="getPerformanceClass(result.score / result.totalQuestions)">
                            {{ getPerformanceText(result.score / result.totalQuestions) }}
                        </div>
                        <div v-if="isAdmin" class="admin-actions">
                            <button @click="editQuiz(result)" class="btn btn-edit">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button @click="confirmDelete(result)" class="btn btn-delete">
                                <i class="fas fa-trash-alt"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="no-history">
                    <p>You haven't taken any quizzes yet.</p>
                    <router-link to="/" class="btn btn-primary">Browse Quizzes</router-link>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="modal">
            <div class="modal-content">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this quiz result?</p>
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
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase'
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const user = ref(null)
        const quizHistory = ref([])
        const isAdmin = ref(false)
        const router = useRouter()
        const isLoading = ref(false)
        const showDeleteModal = ref(false)
        const selectedResult = ref(null)

        const checkAdminStatus = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                isAdmin.value = userDoc.data()?.admin ?? false
            } else {
                isAdmin.value = false
            }
        }

        const loadQuizHistory = async () => {
            if (!auth.currentUser) return

            const q = query(
                collection(db, 'quiz_results'),
                where('userId', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            )

            const querySnapshot = await getDocs(q)
            quizHistory.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        }

        const getPerformanceClass = (percentage) => {
            if (percentage >= 0.9) return 'excellent'
            if (percentage >= 0.7) return 'good'
            if (percentage >= 0.5) return 'fair'
            return 'needs-improvement'
        }

        const getPerformanceText = (percentage) => {
            if (percentage >= 0.9) return 'Excellent!'
            if (percentage >= 0.7) return 'Good Job!'
            if (percentage >= 0.5) return 'Fair'
            return 'Keep Practicing'
        }

        const editQuiz = (result) => {
            router.push({ name: 'editQuiz', params: { id: result.quizId } })
        }

        const confirmDelete = (result) => {
            selectedResult.value = result
            showDeleteModal.value = true
        }

        const cancelDelete = () => {
            selectedResult.value = null
            showDeleteModal.value = false
        }

        const deleteQuiz = async () => {
            if (!selectedResult.value) return

            try {
                isLoading.value = true
                await deleteDoc(doc(db, "quiz_results", selectedResult.value.id))
                await loadQuizHistory()
            } catch (error) {
                console.error('Error deleting quiz result:', error)
            } finally {
                isLoading.value = false
                showDeleteModal.value = false
                selectedResult.value = null
            }
        }

        onMounted(async () => {
            user.value = auth.currentUser
            if (user.value) {
                await checkAdminStatus(user.value)
            }
            loadQuizHistory()
        })

        return {
            user,
            quizHistory,
            isAdmin,
            getPerformanceClass,
            getPerformanceText,
            editQuiz,
            confirmDelete,
            cancelDelete,
            deleteQuiz,
            showDeleteModal,
            isLoading
        }
    }
}
</script>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.profile-card {
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

.profile-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.profile-title {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.user-info h2 {
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
}

.user-info p {
    color: var(--text-color);
}

.section-title {
    color: var(--secondary-color);
    margin-bottom: 1.5rem;
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.history-item {
    background-color: #f8f9fa;
    border-radius: var(--border-radius);
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
}

.quiz-meta {
    display: flex;
    gap: 1rem;
    color: var(--text-color);
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.score-info {
    text-align: right;
}

.score {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color);
}

.date {
    font-size: 0.9rem;
    color: var(--text-color);
    margin-top: 0.5rem;
}

.performance {
    grid-column: 1 / -1;
    padding: 0.5rem;
    text-align: center;
    border-radius: var(--border-radius);
    font-weight: 500;
}

.performance.excellent {
    background-color: rgba(46, 204, 113, 0.1);
    color: #27ae60;
}

.performance.good {
    background-color: rgba(52, 152, 219, 0.1);
    color: #2980b9;
}

.performance.fair {
    background-color: rgba(241, 196, 15, 0.1);
    color: #f39c12;
}

.performance.needs-improvement {
    background-color: rgba(231, 76, 60, 0.1);
    color: #c0392b;
}

.no-history {
    text-align: center;
    padding: 2rem;
    color: var(--text-color);
}

.btn-primary {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: opacity 0.3s ease;
}

.btn-primary:hover {
    opacity: 0.9;
}

.admin-actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.btn-edit {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.btn-delete {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.btn-edit:hover,
.btn-delete:hover {
    opacity: 0.9;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    max-width: 500px;
    width: 90%;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

.warning {
    color: #e74c3c;
    font-weight: 500;
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .profile-container {
        padding: 0 1rem;
    }

    .history-item {
        grid-template-columns: 1fr;
    }

    .score-info {
        text-align: left;
    }

    .quiz-meta {
        flex-direction: column;
        gap: 0.25rem;
    }

    .admin-actions {
        flex-direction: column;
    }
    
    .btn-edit,
    .btn-delete {
        width: 100%;
    }
}
</style> 