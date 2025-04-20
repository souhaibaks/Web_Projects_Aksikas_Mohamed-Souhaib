<template>
  <div class="home">
    <h1 v-if="user">Hello {{ user.displayName }}</h1>
    <listQuiz/>
  </div>
</template>

<script>
import listQuiz from '@/components/listQuiz.vue';
import {auth, db} from '../firebase'
import {ref, onMounted} from 'vue'
import { onAuthStateChanged } from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore'

export default {
  components: {
    listQuiz
  },
  setup() {
    const user = ref(null);
    const is_admin = ref(null)
    
    onMounted(() => {
      onAuthStateChanged(auth, async (u) => {
        if (u) {
          user.value = u
          const userDoc = await getDoc(doc(db, 'users', u.uid))
          is_admin.value = userDoc.data()?.admin ?? false
        }
      })
    })
    
    return {
      user,
      is_admin
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
