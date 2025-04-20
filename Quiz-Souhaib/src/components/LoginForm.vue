<template>
  <div class="form-container">
    <form @submit.prevent="login" class="auth-form">
      <h2 class="form-title">Login</h2>
      <div class="form-group">
        <input type="email" required placeholder="Your email" v-model="email">
      </div>
      <div class="form-group">
        <input type="password" required placeholder="Your password" v-model="password">
      </div>
      <button type="submit" class="btn btn-success">Login</button>
      <div class="error">{{ errors }}</div>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import {auth} from '../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { ref } from 'vue';
export default {
  setup() {
    const email = ref("")
    const password = ref("")
    const errors = ref(null)
    const login = () => {
      signInWithEmailAndPassword(auth, email.value, password.value) 
      .then((userData) => {
        const user = userData.user;
        console.log(user)
      })
      .then(()=> {
        router.push('/')
      })
      .catch((error) => {
        errors.value = error.message;
      })
    }
    return {
      email,
      password,
      errors,
      login
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
  max-width: 400px;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn-success {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-success:hover {
  background-color: var(--secondary-color);
}

.error {
  color: var(--accent-color);
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .form-container {
    padding: 0 1rem;
  }
  
  .auth-form {
    padding: 1.5rem;
  }
}
</style>