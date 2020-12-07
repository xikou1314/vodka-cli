import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/platformlist',
    name: 'PlatformList',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PlatformList.vue')
  },
  {
    path: '/platformdetail',
    name: 'PlatformDetail',
    component: () => import('../views/PlatformDetail.vue')
  },
  {
    path: '/devicelist',
    name: 'DeviceList',
    component: () => import('../views/DeviceList.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
