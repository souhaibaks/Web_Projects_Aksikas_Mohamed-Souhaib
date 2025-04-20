<template>
  <div id="app">
    <AppNavbar />
    <main class="main-content">
      <router-view/>
    </main>
  </div>
</template>

<script>
import AppNavbar from './components/Navbar.vue'

export default {
  components: {
    AppNavbar
  }
}
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}
</style>
