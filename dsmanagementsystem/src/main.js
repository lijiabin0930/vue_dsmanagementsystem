import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/global.css"

import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.config.productionTip = false

import 'element-ui/lib/theme-chalk/index.css';
//使用axios
import axios from "axios";
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


// 0:
// authName: "用户管理"
// children: Array(1)
// 0: {id: 110, authName: "用户列表", path: "users", children: Array(0), order: null}
// length: 1
// __proto__: Array(0)
// id: 125
// order: 1
// path: "users"
// __proto__: Object
// 1: {id: 103, authName: "权限管理", path: "rights", children: Array(2), order: 2}
// 2: {id: 101, authName: "商品管理", path: "goods", children: Array(3), order: 3}
// 3: {id: 102, authName: "订单管理", path: "orders", children: Array(1), order: 4}
// 4: {id: 145, authName: "数据统计", path: "reports", children: Array(1), order: 5}
// length: 5
// __proto__: Array(0)
