import Vue from 'vue'
import VueRouter from 'vue-router'
import { getStore } from '../assets/js/utils'

Vue.use(VueRouter)
// 解决vue-router重复点击菜单报错的问题
const originalPush = VueRouter.prototype.push;//把保存原来的push函数
VueRouter.prototype.push = function push(location) {//重写push函数
  return originalPush.call(this, location).catch(err => err);//调用原来的push函数，并捕获异常
};
const Login = () => import('../views/Login.vue')
const Home = () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue')
const Hotel = () => import(/* webpackChunkName: "home" */ '../views/Hotel.vue')
const Device = () => import(/* webpackChunkName: "home" */ '../views/Device.vue')
const Order = () => import(/* webpackChunkName: "home" */ '../views/Order.vue')
const User = () => import(/* webpackChunkName: "home" */ '../views/User.vue')
const Fault = () => import(/* webpackChunkName: "home" */ '../views/Fault.vue')
const FaultInfo = () => import(/* webpackChunkName: "home" */ '../views/FaultInfo.vue')
const RegisterDevice = () => import(/* webpackChunkName: "home" */ '../views/RegisterDevice.vue')
const Cost = () => import(/* webpackChunkName: "home" */ '../views/Cost.vue')
const SetPassword = () => import(/* webpackChunkName: "home" */ '../views/SetPassword.vue')


const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/index',
    name: '首页',
    component: Home,
    children: [
      { path: '/hotel', name: 'hotel', component: Hotel },
      { path: '/device', name: 'device', component: Device },
      { path: '/order', name: 'order', component: Order },
      { path: '/user', name: 'user', component: User },
      { path: '/fault', name: 'fault', component: Fault },
      { path: '/faultInfo', name: 'faultInfo', component: FaultInfo },
      { path: '/registerDevice', name: 'registerDevice', component: RegisterDevice },
      { path: '/cost', name: 'cost', component: Cost },
      { path: '/setPassword', name: 'setPassword', component: SetPassword },

      
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    if (!getStore('token')) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
