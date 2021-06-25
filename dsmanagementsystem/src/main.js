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

