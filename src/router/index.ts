import { createRouter, createWebHistory } from 'vue-router';

import CartPage from '../pages/CartPage.vue';
import GiftsPage from '../pages/GiftsPage.vue';
import SealPage from '../pages/SealPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'gifts',
      component: GiftsPage,
    },
    {
      path: '/selo',
      name: 'seal',
      component: SealPage,
    },
    {
      path: '/carrinho',
      name: 'cart',
      component: CartPage,
    },
  ],
});

export default router;
