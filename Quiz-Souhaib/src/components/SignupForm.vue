<template>
  <div class="form-container">
    <form @submit.prevent="createUser" class="auth-form">
      <h2 class="form-title">Create Account</h2>
      <div class="form-group">
        <input 
          type="text" 
          required 
          placeholder="Display name" 
          v-model="displayName"
          aria-label="Display name">
      </div>
      <div class="form-group">
        <input 
          type="email" 
          required 
          placeholder="Your email" 
          v-model="email"
          aria-label="Email address">
      </div>
      <div class="form-group">
        <input 
          type="password" 
          required 
          placeholder="Your password" 
          v-model="password"
          aria-label="Password">
      </div>
      <div class="form-group checkbox-group">
        <label for="admin-checkbox">Role: Admin?</label>
        <input 
          type="checkbox" 
          id="admin-checkbox"
          v-model="admin"
          aria-label="Administrator role">
      </div>
      <button type="submit" class="btn btn-success">Sign up</button>
      <div class="error" role="alert">{{ errors }}</div>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref } from 'vue';

export default {
  setup() {
    const displayName = ref('');
    const email = ref('');
    const password = ref('');
    const errors = ref(null);
    const admin = ref(false);

    const createUser = () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userData) => {
          const user = userData.user;
          await setDoc(doc(db, 'users', user.uid), {
            name: displayName.value,
            email: email.value,
            admin: admin.value
          });
          return updateProfile(user, { displayName: displayName.value });
        })
        .then(() => {
          router.push('/');
        })
        .catch((error) => {
          errors.value = error.message;
        });
    };

    return {
      displayName,
      email,
      password,
      errors,
      admin,
      createUser
    };
  }
};
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkbox-group label {
  color: var(--text-color);
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