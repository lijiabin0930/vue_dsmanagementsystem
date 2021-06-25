import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './ts/css/global.css'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.config.productionTip = false

import 'element-ui/lib/theme-chalk/index.css';
//使用axios
import axios from "axios";
Vue.prototype.$http = axios //绑定
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

