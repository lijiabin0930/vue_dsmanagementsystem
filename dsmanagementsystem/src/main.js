import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "./assets/css/global.css"

//导入阿里icon生成的图标
import "./assets/fonts/iconfont.css"


import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
//使用axios
import axios from "axios";

Vue.use(ElementUI);
Vue.config.productionTip = false


Vue.prototype.$http = axios //绑定
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

//请求拦截器 加上token 每次请求都可以带上headers了
axios.interceptors.request.use(config=>{
  //header 在请求服务器前最后一步挂载上Authorization请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config.headers.Authorization,">>>>");
  return config
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//Vue 对console.log的封装 可以打印出来的内容清晰可见 this.print调用 很好用
Vue.prototype.print = (obj,type) => {
  type = type || "log";
  const log = JSON.parse(JSON.stringify(obj));
  console[type](log)
}



// {
//   "data": [
//   {
//     "id": 125,
//     "authName": "用户管理",
//     "path": "users",
//     "children": [
//       {
//         "id": 110,
//         "authName": "用户列表",
//         "path": "users",
//         "children": [],
//         "order": null
//       }
//     ],
//     "order": 1
//   },
//   {
//     "id": 103,
//     "authName": "权限管理",
//     "path": "rights",
//     "children": [
//       {
//         "id": 111,
//         "authName": "角色列表",
//         "path": "roles",
//         "children": [],
//         "order": null
//       },
//       {
//         "id": 112,
//         "authName": "权限列表",
//         "path": "rights",
//         "children": [],
//         "order": null
//       }
//     ],
//     "order": 2
//   },
//   {
//     "id": 101,
//     "authName": "商品管理",
//     "path": "goods",
//     "children": [
//       {
//         "id": 104,
//         "authName": "商品列表",
//         "path": "goods",
//         "children": [],
//         "order": 1
//       },
//       {
//         "id": 115,
//         "authName": "分类参数",
//         "path": "params",
//         "children": [],
//         "order": 2
//       },
//       {
//         "id": 121,
//         "authName": "商品分类",
//         "path": "categories",
//         "children": [],
//         "order": 3
//       }
//     ],
//     "order": 3
//   },
//   {
//     "id": 102,
//     "authName": "订单管理",
//     "path": "orders",
//     "children": [
//       {
//         "id": 107,
//         "authName": "订单列表",
//         "path": "orders",
//         "children": [],
//         "order": null
//       }
//     ],
//     "order": 4
//   },
//   {
//     "id": 145,
//     "authName": "数据统计",
//     "path": "reports",
//     "children": [
//       {
//         "id": 146,
//         "authName": "数据报表",
//         "path": "reports",
//         "children": [],
//         "order": null
//       }
//     ],
//     "order": 5
//   }
// ],
//     "meta": {
//   "msg": "获取菜单列表成功",
//       "status": 200
// }
// }