import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./components/Login.vue')
    },
    {
      path:'/home',
      name:'home',
      component: () =>import('./components/Home')
    }
  ]
})
//挂载路由导航守卫
//to 要去的路径 from 从哪里来 next()跳转页面 可以下一步 可以指定路由
router.beforeEach((to,from,next)=>{
  //判断是不是登录页面 是直接放行
  if (to.path === '/login'){return next()}
  //不是登录页面要看token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr){return next("/login")}
  return next()
})



export default router