<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">Quiz App</router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/leaderboard" class="nav-link">Leaderboard</router-link>
        <router-link v-if="user && isAdmin" to="/CreateQuizz" class="nav-link">Create Quiz</router-link>
        <template v-if="!user">
          <router-link to="/Login" class="nav-link">Login</router-link>
          <router-link to="/Signup" class="nav-link">Sign Up</router-link>
        </template>
        <template v-else>
          <router-link to="/profile" class="nav-link">Profile</router-link>
          <span class="nav-link user-email">{{ user.email }}</span>
          <button @click="handleLogout" class="nav-link logout-btn">Logout</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { ref, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import getUser from '../composables/getUser'

export default {
  name: 'AppNavbar',
  setup() {
    const router = useRouter()
    const { user } = getUser()
    const isAdmin = ref(false)

    const checkAdminStatus = async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()
        isAdmin.value = userData && userData.admin ? userData.admin : false
      } else {
        isAdmin.value = false
      }
    }

    const handleLogout = async () => {
      try {
        await auth.signOut()
        router.push('/')
      } catch (err) {
        console.error('Error logging out:', err)
      }
    }

    onMounted(async () => {
      if (user.value) {
        await checkAdminStatus(user.value)
      }
    })

    return { user, isAdmin, handleLogout }
  }
}
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.nav-brand:hover {
  color: var(--secondary-color);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: rgba(74, 144, 226, 0.1);
}

.nav-link.router-link-exact-active {
  color: var(--primary-color);
  background-color: rgba(74, 144, 226, 0.1);
}

.user-email {
  color: var(--secondary-color);
  cursor: default;
}

.user-email:hover {
  background-color: transparent;
  color: var(--secondary-color);
}

.logout-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c0392b;
  color: white;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    justify-content: center;
  }

  .nav-link {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }
}
</style> 