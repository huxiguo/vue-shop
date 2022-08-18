import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式
import '@/assets/css/global.css'
// 字体图标
import '@/assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  // Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
