<template>
    <div class="leaderboard-container">
        <div class="leaderboard-tabs">
            <button 
                @click="activeTab = 'global'"
                :class="{ active: activeTab === 'global' }"
                class="tab-button"
            >
                Global Leaderboard
            </button>
            <button 
                @click="activeTab = 'quiz'"
                :class="{ active: activeTab === 'quiz' }"
                class="tab-button"
            >
                Quiz Leaderboards
            </button>
            <button 
                v-if="isAdmin"
                @click="confirmReset"
                class="tab-button reset-button"
            >
                Reset Leaderboard
            </button>
        </div>

        <!-- Reset Confirmation Modal -->
        <div v-if="showResetModal" class="modal">
            <div class="modal-content">
                <h3>Reset Leaderboard</h3>
                <p>Are you sure you want to reset all user scores? This action cannot be undone!</p>
                <div class="modal-actions">
                    <button @click="resetLeaderboard" class="btn btn-danger" :disabled="isResetting">
                        {{ isResetting ? 'Resetting...' : 'Reset' }}
                    </button>
                    <button @click="cancelReset" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>

        <!-- Global Leaderboard -->
        <div v-if="activeTab === 'global'" class="leaderboard-section">
            <h2 class="section-title">Top Performers</h2>
            <div class="leaderboard-list">
                <div v-for="(user, index) in globalLeaderboard" :key="user.id" class="leaderboard-item">
                    <div class="rank" :class="{'top-three': index < 3}">
                        #{{ index + 1 }}
                    </div>
                    <div class="user-info">
                        <span class="username">{{ user.name }}</span>
                        <span class="total-score">Total Score: {{ user.totalScore }}</span>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <span class="label">Quizzes</span>
                            <span class="value">{{ user.quizzesTaken }}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Avg. Score</span>
                            <span class="value">{{ Math.round(user.averageScore) }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quiz-specific Leaderboards -->
        <div v-else class="leaderboard-section">
            <div class="quiz-selector">
                <label for="quizSelect">Select Quiz:</label>
                <select v-model="selectedQuiz" id="quizSelect" class="quiz-select">
                    <option value="">Choose a quiz</option>
                    <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                        {{ quiz.title }}
                    </option>
                </select>
            </div>

            <div v-if="selectedQuiz" class="quiz-leaderboard">
                <h2 class="section-title">{{ getQuizTitle(selectedQuiz) }} - Top Scores</h2>
                <div class="leaderboard-list">
                    <div v-for="(score, index) in quizLeaderboard" :key="score.id" class="leaderboard-item">
                        <div class="rank" :class="{'top-three': index < 3}">
                            #{{ index + 1 }}
                        </div>
                        <div class="user-info">
                            <span class="username">{{ score.displayName }}</span>
                            <span class="score">{{ score.score }}/{{ score.totalQuestions }}</span>
                        </div>
                        <div class="percentage">
                            {{ Math.round((score.score / score.totalQuestions) * 100) }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { db, auth } from '../firebase'
import { collection, query, orderBy, limit, getDocs, where, doc, writeBatch, getDoc } from 'firebase/firestore'

export default {
    name: 'QuizLeaderboard',
    setup() {
        const activeTab = ref('global')
        const globalLeaderboard = ref([])
        const quizLeaderboard = ref([])
        const quizzes = ref([])
        const selectedQuiz = ref('')
        const isAdmin = ref(false)
        const showResetModal = ref(false)
        const isResetting = ref(false)

        const checkAdminStatus = async () => {
            if (auth.currentUser) {
                const userDocRef = doc(db, 'users', auth.currentUser.uid)
                const userDoc = await getDoc(userDocRef)
                isAdmin.value = userDoc.data()?.admin ?? false
            }
        }

        const confirmReset = () => {
            showResetModal.value = true
        }

        const cancelReset = () => {
            showResetModal.value = false
        }

        const resetLeaderboard = async () => {
            try {
                isResetting.value = true
                const batch = writeBatch(db)
                
                // Reset all users' scores
                const usersSnapshot = await getDocs(collection(db, 'users'))
                usersSnapshot.forEach((userDoc) => {
                    batch.update(doc(db, 'users', userDoc.id), {
                        totalScore: 0,
                        quizzesTaken: 0,
                        averageScore: 0
                    })
                })

                // Delete all quiz results
                const resultsSnapshot = await getDocs(collection(db, 'quiz_results'))
                resultsSnapshot.forEach((resultDoc) => {
                    batch.delete(doc(db, 'quiz_results', resultDoc.id))
                })

                await batch.commit()
                await loadGlobalLeaderboard()
                showResetModal.value = false
            } catch (error) {
                console.error('Error resetting leaderboard:', error)
            } finally {
                isResetting.value = false
            }
        }

        const loadGlobalLeaderboard = async () => {
            const q = query(
                collection(db, 'users'),
                orderBy('averageScore', 'desc'),
                limit(10)
            )
            const querySnapshot = await getDocs(q)
            globalLeaderboard.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        }

        const loadQuizzes = async () => {
            const querySnapshot = await getDocs(collection(db, 'Quizzes'))
            quizzes.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        }

        const loadQuizLeaderboard = async (quizId) => {
            if (!quizId) return
            
            try {
                // First try with the indexed query
                const q = query(
                    collection(db, 'quiz_results'),
                    where('quizId', '==', quizId),
                    orderBy('score', 'desc'),
                    limit(10)
                )
                const querySnapshot = await getDocs(q)
                quizLeaderboard.value = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            } catch (error) {
                if (error.code === 'failed-precondition') {
                    // Fallback: Get all results for this quiz and sort them in memory
                    const q = query(
                        collection(db, 'quiz_results'),
                        where('quizId', '==', quizId)
                    )
                    const querySnapshot = await getDocs(q)
                    const results = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    // Sort in memory and take top 10
                    quizLeaderboard.value = results
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 10)
                } else {
                    console.error("Error loading leaderboard:", error)
                    quizLeaderboard.value = []
                }
            }
        }

        const getQuizTitle = (quizId) => {
            const quiz = quizzes.value.find(q => q.id === quizId)
            return quiz ? quiz.title : ''
        }

        watch(selectedQuiz, (newQuizId) => {
            if (newQuizId) {
                loadQuizLeaderboard(newQuizId)
            }
        })

        onMounted(() => {
            loadGlobalLeaderboard()
            loadQuizzes()
            checkAdminStatus()
        })

        return {
            activeTab,
            globalLeaderboard,
            quizLeaderboard,
            quizzes,
            selectedQuiz,
            getQuizTitle,
            isAdmin,
            showResetModal,
            isResetting,
            confirmReset,
            cancelReset,
            resetLeaderboard
        }
    }
}
</script>

<style scoped>
.leaderboard-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.leaderboard-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.tab-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius);
    background-color: #f8f9fa;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-button.active {
    background-color: var(--primary-color);
    color: white;
}

.section-title {
    color: var(--secondary-color);
    margin-bottom: 1.5rem;
}

.leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.leaderboard-item {
    background-color: white;
    border-radius: var(--border-radius);
    padding: 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--text-color);
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    border-radius: var(--border-radius);
}

.rank.top-three {
    background-color: var(--primary-color);
    color: white;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.username {
    font-weight: 500;
    color: var(--secondary-color);
}

.total-score, .score {
    font-size: 0.9rem;
    color: var(--text-color);
}

.stats {
    display: flex;
    gap: 1rem;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.label {
    font-size: 0.8rem;
    color: var(--text-color);
}

.value {
    font-weight: 500;
    color: var(--primary-color);
}

.quiz-selector {
    margin-bottom: 2rem;
}

.quiz-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-size: 1rem;
    margin-top: 0.5rem;
}

.percentage {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color);
}

.reset-button {
    background-color: #dc3545;
    color: white;
}

.reset-button:hover {
    background-color: #c82333;
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

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-danger:disabled {
    background-color: #e4606d;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .leaderboard-container {
        padding: 0 1rem;
    }

    .leaderboard-tabs {
        flex-direction: column;
    }

    .leaderboard-item {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .stats {
        justify-content: center;
    }

    .rank {
        margin: 0 auto;
    }
}
</style> 