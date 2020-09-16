import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store';

Vue.use(VueRouter);

const beforeEnter = (to, from, next) => {
  if (store.state.user.isLoggedIn) {
    next();
  } else {
    next('/');
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/products',
    name: 'Product',
    component: () => import(/* webpackChunkName: "product" */ '../views/Products.vue'),
    beforeEnter,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
