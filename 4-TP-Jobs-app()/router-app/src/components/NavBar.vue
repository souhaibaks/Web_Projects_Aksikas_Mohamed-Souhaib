<template>
    <nav>
        <router-link to="/" class="logo">Mon Blog</router-link>
        <div class="links">
            <router-link to="/">Accueil</router-link>
            <router-link to="/create">Nouveau Post</router-link>
        </div>
    </nav>
</template>

<style>
nav {
    background-color: #f8f8f8;
    padding: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

.logo {
    font-size: 20px;
    color: #333;
    text-decoration: none;
    font-weight: bold;
}

.links {
    float: right;
}

.links a {
    color: #333;
    text-decoration: none;
    margin-left: 15px;
}

.links a:hover {
    color: blue;
}
</style> 