import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import './static/css/resrt.css'
import JsonExcel from "vue-json-excel";
Vue.use(ElementUI);
Vue.component("downloadExcel", JsonExcel);
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$http = axios.create({
  baseURL:'http://xxx.xx.xx.xxx:xxxx'//axios请求根路径
})
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
