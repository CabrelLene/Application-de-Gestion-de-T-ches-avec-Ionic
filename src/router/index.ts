// src/router/index.ts
import { createRouter, createWebHistory } from '@ionic/vue-router'
import Tabs from '@/pages/tabs/Tabs.vue'
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'
import ForgotPassword from '@/pages/auth/ForgotPassword.vue'
import ChangePassword from '@/pages/auth/ChangePassword.vue'
import { currentUser, authReady } from '@/composables/useAuth'

const routes = [
  { path: '/', redirect: '/tabs' },
  { path: '/auth/login', component: Login, meta: { guestOnly: true } },
  { path: '/auth/register', component: Register, meta: { guestOnly: true } },
  { path: '/auth/forgot', component: ForgotPassword, meta: { guestOnly: true } },
  { path: '/auth/change', component: ChangePassword, meta: { authOnly: true } },
  {
    path: '/tabs',
    component: Tabs,
    meta: { authOnly: true },
    children: [
      { path: '', redirect: '/tabs/active' },
      { path: 'active', component: () => import('@/pages/tabs/ActiveTasks.vue'), meta: { authOnly: true } },
      { path: 'closed', component: () => import('@/pages/tabs/ClosedTasks.vue'), meta: { authOnly: true } },
      { path: 'archived', component: () => import('@/pages/tabs/ArchivedTasks.vue'), meta: { authOnly: true } },
      // ⬇️ Route enfant "Paramètres"
      { path: 'settings', component: () => import('@/pages/Settings.vue'), meta: { authOnly: true } },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/tabs' }
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })

router.beforeEach(async (to, _from, next) => {
  await authReady
  const isAuth = !!currentUser.value
  if (to.meta?.authOnly && !isAuth) return next('/auth/login')
  if (to.meta?.guestOnly && isAuth) return next('/tabs')
  next()
})

export default router
