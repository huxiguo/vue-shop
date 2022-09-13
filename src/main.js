import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式
import '@/assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 字体图标
import '@/assets/fonts/iconfont.css'

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
