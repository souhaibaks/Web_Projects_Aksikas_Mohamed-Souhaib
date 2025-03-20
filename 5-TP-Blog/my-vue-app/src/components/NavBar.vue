<template>
  <nav class="navbar">
    <div class="container">
      <router-link class="brand" to="/">Blog App</router-link>
      <div class="nav-links">
        <router-link class="link" to="/">Home</router-link>
        <router-link class="link" to="/create">Add Post</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  background-color: #4CAF50;
  padding: 1rem;
  margin-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 