import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API LOCAL
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/auth/';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
