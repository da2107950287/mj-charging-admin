import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { http, download } from './assets/js/utils.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/js/rem'
Vue.prototype.$http = http;
Vue.prototype.$download = download;

Vue.use(ElementUI);
Vue.config.productionTip = false

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default vue