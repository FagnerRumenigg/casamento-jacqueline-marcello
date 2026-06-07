import { createRouter, createWebHistory } from 'vue-router';

import CardPage from '../pages/CardPage.vue';
import GiftsPage from '../pages/GiftsPage.vue';
import NoivosCardsPage from '../pages/NoivosCardsPage.vue';

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
      path: '/noivos/cartoes',
      name: 'couple-cards',
      component: NoivosCardsPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
