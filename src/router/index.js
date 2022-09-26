import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/power/Roles.vue')

const Add = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/goods/add.vue')
const Order = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/report/Report.vue')

const Cate = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/goods/Params.vue')
const Goods = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/goods/List.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/users', component: Users },
      { path: '/welcome', component: Welcome },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转来
  // next 一个函数，表示放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
