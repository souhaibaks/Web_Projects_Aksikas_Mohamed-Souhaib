import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CreatePostView from '../views/CreatePostView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import JobsView from '../views/jobs/JobsView'
import JobDetails from '../views/jobs/JobDetails'
import ErrorPage from '../views/ErrorPage'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: CreatePostView
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetailView,
    props: true
  },
  {
    path: '/tags/:tag',
    name: 'TagPosts',
    component: Home,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: JobsView
  },
  {
    path: '/jobs/:id',
    name: 'jobdetails',
    component: JobDetails,
    props: true // ACCEPT ANY ROUTE PARAMS AS A PROPS
  },
  //REDIRECT
  {
    path: '/all-jobs', //old route
    redirect: '/jobs' //route to be redirected to
  },
  //catch 404 pages (ALL PAGES THAT ARE NOT ON THE ROUTE ARRAY)
  {
    path: '/:catchAll(.*)', //MUST BE THE SAME AS THIS
    name: '404',
    component: ErrorPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
