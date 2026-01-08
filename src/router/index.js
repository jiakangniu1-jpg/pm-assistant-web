import Vue from 'vue'
import VueRouter from 'vue-router'
import PMView from '../views/PMView.vue'
import ProgrammerView from '../views/ProgrammerView.vue'
import DoctorView from '../views/DoctorView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/pm'
  },
  {
    path: '/pm',
    name: 'pm',
    component: PMView
  },
  {
    path: '/dev',
    name: 'dev',
    component: ProgrammerView
  },
  {
    path: '/doctor',
    name: 'doctor',
    component: DoctorView
  }
]

const router = new VueRouter({
  routes
})

export default router
