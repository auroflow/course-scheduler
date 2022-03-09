import { createRouter, createWebHistory } from 'vue-router'
import EditSemester from '../components/EditSemester.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/edit-semester',
      name: 'edit-semester',
      component: EditSemester,
      props: (route) => ({ from: route.query.from }),
      alias: '/',
    },
    {
      path: '/edit-schedule',
      name: 'edit-schedule',
      component: () => import('../components/EditSchedule.vue'),
    },
    {
      path: '/save-and-export',
      name: 'save-and-export',
      component: () => import('../components/SaveAndExport.vue'),
    },
  ],
})
