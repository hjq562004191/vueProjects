import Vue from 'vue'
import App from './App.vue'

// 引入路由
import router from "./router/index.js"   
import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'


import axios from 'axios'


axios.defaults.baseURL = 'https://haojianqiang.top/api'
// 在request 拦截器中, 展示进度条 NProgress.start()
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.token = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  return config
})
// 挂在到Vue实例，后面可通过this调用
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  router,  // 注入到根实例中
  render: h => h(App)
})