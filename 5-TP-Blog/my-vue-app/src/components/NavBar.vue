<template>
  <nav class="navbar">
    <router-link to="/" class="brand">Blog App</router-link>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/create">Add Post</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  padding: 1rem 2rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  background: #e9ecef;
  color: #333;
}

.nav-links a.router-link-active {
  color: #007bff;
  background: #e7f1ff;
}
</style>
