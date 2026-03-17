import { createRouter, createWebHistory } from 'vue-router'
import PlaygroundView from '@/views/PlaygroundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'playground',
      component: PlaygroundView,
    },
  ],
})

export default router
