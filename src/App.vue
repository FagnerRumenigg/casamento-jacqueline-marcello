<script setup lang="ts">
import Footer from './components/layout/Footer.vue';
import Header from './components/layout/Header.vue';
</script>

<template>
  <div class="app-shell">
    <Header />

    <main class="main-content">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.main-content {
  padding-top: calc(var(--header-height) + var(--space-8));
  padding-bottom: var(--space-12);
  display: flex;
  flex: 1;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: var(--space-8);
    padding-bottom: calc(var(--space-12) + 70px);
  }
}
</style>
