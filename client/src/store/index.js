import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user.module';
import product from './modules/product.module';
import shop from './modules/shop.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    product,
    shop,
  },
});
