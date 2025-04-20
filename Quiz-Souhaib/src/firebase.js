import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyCVW0bgoxmAOfWG6zRquHiBScXyAFUg908",
  authDomain: "quizz-project-d8d8c.firebaseapp.com",
  projectId: "quizz-project-d8d8c",
  storageBucket: "quizz-project-d8d8c.firebasestorage.app",
  messagingSenderId: "475576911820",
  appId: "1:475576911820:web:be0e27546e0261e3cb7f69"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);
