<template>
  <footer class="footer">
    <div class="page-container footer-content">
      <div class="brand">Jacqueline e Marcello</div>
      <p class="text">Feito com carinho para celebrar esse novo comeco.</p>
      <p class="copyright">© 2026 Jacqueline e Marcello</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--color-surface-border);
  background: color-mix(in srgb, white 76%, transparent);
}

.footer-content {
  text-align: center;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-10) var(--space-4) calc(var(--space-10) + 70px);
}

.brand {
  font-family: var(--font-display);
  color: var(--color-primary);
  font-style: italic;
  font-size: 1.25rem;
}

.text,
.copyright {
  margin: 0;
  color: var(--color-text-muted);
}

@media (min-width: 769px) {
  .footer-content {
    padding-bottom: var(--space-10);
  }
}
</style>
