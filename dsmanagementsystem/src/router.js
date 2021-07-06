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
      component: () => import('./components/Login.vue')
    },
    {
      path:'/home',
      name:'home',
      component: () =>import('./components/Home'),
      redirect:'/home/welcome',
      children:[
        {
          path: '/home/welcome',
          name: 'welcome',
          component: () => import('../src/components/Welcome')
        },
        {
          path:'/home/users',
          name: 'users',
          component: ()=> import('../src/components/user/users')
        },
        {
          path:'/home/rights',
          name: 'rights',
          component: ()=>import('../src/components/power/Rights')
        },
        {
          path:'/home/roles',
          name:'roles',
          component: ()=>import('../src/components/power/Roles')
        },{
          path: '/home/categories',
          name:'roles',
          component: ()=>import('../src/components/goods/cates')
        }
      ]
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