import { createRouter, createWebHistory } from 'vue-router';

import GiftsPage from '../pages/GiftsPage.vue';
import CardPage from '../pages/CardPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gifts',
      component: GiftsPage,
    },
    {
      path: '/cartao',
      name: 'card',
      component: CardPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/', // 🔥 evita erro de rota tipo /carrinho
    },
  ],
});

export default router;
