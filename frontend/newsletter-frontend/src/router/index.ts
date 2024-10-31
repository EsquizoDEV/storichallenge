import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Otherview.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/newsletters',
      name: 'newsletters',
      component: () => import('../views/NewsLettersView.vue'),
    },
    {
      path: '/unsubscribe',
      name: 'unsubscribe',
      component: () => import('../views/UnsubscribeView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (!user) {
      return next({ name: 'login' })
    }

    const parsedUser = JSON.parse(user)

    if (to.matched.some(route => route.meta.requiresAdmin)) {
      if (parsedUser.role !== 'admin') {
        return next({ name: 'login' })
      }
    }
  }
  return next()
})

export default router
