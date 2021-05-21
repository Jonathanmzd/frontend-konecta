import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// Importamos la tienda
import store from '../store/index';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import(/* webpackChunkName: "about" */ '../views/Clientes.vue'), meta: { requireAuth: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import(/* webpackChunkName: "about" */ '../views/Usuarios.vue'), meta: { requireAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const rutaProtegida = to.matched.some(record => record.meta.requireAuth);

  if(rutaProtegida && store.state.token === ''){
    // console.log(store.state.token);
    next({name: 'login'})

  }else{
    next()
  }

})

export default router
