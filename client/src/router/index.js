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

const beforeEnterAdmin = (to, from, next) => {
  if (store.state.user.isLoggedIn && store.state.user.isAdmin) {
    next();
  } else {
    next('/products');
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
  {
    path: '/users',
    name: 'User',
    component: () => import(/* webpackChunkName: "user" */ '../views/Users.vue'),
    beforeEnter: beforeEnterAdmin,
  },
  {
    path: '/shops',
    name: 'Shop',
    component: () => import(/* webpackChunkName: "shop" */ '../views/Shops.vue'),
    beforeEnter: beforeEnterAdmin,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
