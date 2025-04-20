import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import signup from '../components/SignupForm.vue'
import login from '../components/LoginForm.vue'
import createquizz from '@/components/createQuizz.vue'
import quizDetails from '@/views/QuizDetails.vue'
import editQuiz from '@/components/EditQuiz.vue'
import UserProfile from '@/components/UserProfile.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import { auth } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/Signup',
    name: 'Signup',
    component: signup
  }, 
  {
    path:'/Login',
    name: 'Login',
    component: login
  },
  {
    path:'/CreateQuizz',
    name:'Createquizz',
    component: createquizz,
    meta: { requiresAuth: true, requiresAdmin: true }
  }, 
  {
    path:'/listquiz/:id',
    name:'quizdetail',
    component: quizDetails
  },
  {
    path:'/edit-quiz/:id',
    name:'editQuiz',
    component: editQuiz,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const user = auth.currentUser

  if (requiresAuth && !user) {
    next('/login')
  } else if (requiresAdmin) {
    if (!user) {
      next('/login')
    } else {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const isAdmin = userDoc.data()?.admin ?? false
      if (!isAdmin) {
        next('/')
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
