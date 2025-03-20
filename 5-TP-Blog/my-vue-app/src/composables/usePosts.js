import { ref, onMounted } from 'vue'

export function usePosts() {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Posts de démonstration par défaut
  const defaultPosts = [
    {
      id: 1,
      title: 'Test Post 1',
      body: 'Ceci est un post de test. Lorem ipsum dolor sit amet.',
      tags: ['test', 'demo']
    },
    {
      id: 2,
      title: 'Test Post 2',
      body: 'Un autre post de test. Consectetur adipiscing elit.',
      tags: ['test', 'demo']
    },
    {
      id: 3,
      title: 'Test Post 3',
      body: 'Encore un post de test. Sed do eiusmod tempor.',
      tags: ['test', 'demo']
    },
    {
      id: 4,
      title: 'Test Post 4',
      body: 'Post de test numéro 4. Ut labore et dolore magna aliqua.',
      tags: ['test', 'demo']
    },
    {
      id: 5,
      title: 'Test Post 5',
      body: 'Cinquième post de test. Ut enim ad minim veniam.',
      tags: ['test', 'demo']
    },
    {
      id: 6,
      title: 'Test Post 6',
      body: 'Sixième post de test. Quis nostrud exercitation ullamco.',
      tags: ['test', 'demo']
    },
    {
      id: 7,
      title: 'Test Post 7',
      body: 'Septième post de test. Laboris nisi ut aliquip ex ea.',
      tags: ['test', 'demo']
    },
    {
      id: 8,
      title: 'Test Post 8',
      body: 'Huitième post de test. Commodo consequat duis aute.',
      tags: ['test', 'demo']
    },
    {
      id: 9,
      title: 'Test Post 9',
      body: 'Neuvième post de test. Irure dolor in reprehenderit.',
      tags: ['test', 'demo']
    },
    {
      id: 10,
      title: 'Test Post 10',
      body: 'Dixième post de test. Voluptate velit esse cillum dolore.',
      tags: ['test', 'demo']
    }
  ]

  // Charger les articles depuis localStorage
  const loadPosts = () => {
    try {
      const savedPosts = localStorage.getItem('posts')
      if (savedPosts) {
        posts.value = JSON.parse(savedPosts)
      } else {
        // Si aucun post n'existe, utiliser les posts de démonstration
        posts.value = defaultPosts
        savePosts()
      }
    } catch (err) {
      console.error('Error loading posts:', err)
      posts.value = defaultPosts
      savePosts()
    }
  }

  // Sauvegarder les articles dans localStorage
  const savePosts = () => {
    try {
      localStorage.setItem('posts', JSON.stringify(posts.value))
    } catch (err) {
      console.error('Error saving posts:', err)
    }
  }

  // Ajouter un nouvel article
  const addPost = (newPost) => {
    const post = {
      ...newPost,
      id: Date.now(), // Utiliser timestamp comme ID
      tags: newPost.tagsInput.split(',').map(tag => tag.trim())
    }
    posts.value.push(post)
    savePosts()
    return post
  }

  // Charger les articles au démarrage
  onMounted(() => {
    loadPosts()
  })

  // Charger les articles immédiatement aussi
  loadPosts()

  return {
    posts,
    loading,
    error,
    addPost
  }
} 