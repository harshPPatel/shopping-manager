import API from '../../API';
import { REQUEST_METHODS } from '../../config';

export default {
  state: {
    error: null,
    shops: [],
  },
  getters: { },
  mutations: {
    updateShops(state, value) {
      state.shops = value;
    },
    updateError(state, value) {
      state.error = value;
    },
    addShop(state, value) {
      state.shops.push(value);
    },
    updateUser(state, value) {
      // eslint-disable-next-line
      const shopIndex = state.shops.findIndex((shop) => shop._id === value._id);
      state.shops.splice(shopIndex, 1, value);
    },
    deleteShop(state, id) {
      // eslint-disable-next-line
      const shopIndex = state.shops.findIndex((shop) => shop._id === id);
      state.shops.splice(shopIndex, 1);
    },
  },
  actions: {
    async fetchShops({ commit }) {
      await API(REQUEST_METHODS.GET, '/shops/')
        .then(({ shops }) => {
          commit('updateShops', shops, { module: 'shop' });
        })
        .catch((err) => {
          commit('updateError', err.message, { module: 'shop' });
        });
    },
    async createShop({ commit }, item) {
      commit('updateError', null, { module: 'shop' });
      await API(REQUEST_METHODS.POST, '/shops/create', item)
        .then(({ createdShop }) => {
          commit('addShop', createdShop, { module: 'shop' });
        })
        .catch((err) => {
          console.error(err);
          commit('updateError', err.message, { module: 'shop' });
        });
    },
    async updateShop({ commit }, item) {
      commit('updateError', null, { module: 'shop' });
      // eslint-disable-next-line
      await API(REQUEST_METHODS.PATCH, `/shops/${item._id}`, {
        name: item.name.toString(),
      })
        .then(({ updatedShop }) => {
          commit('updateShop', updatedShop, { module: 'shop' });
        })
        .catch((err) => {
          console.error(err);
          commit('updateError', err.message, { module: 'shop' });
        });
    },
    async deleteShop({ commit }, id) {
      commit('updateError', null, { module: 'shop' });
      await API(REQUEST_METHODS.DELETE, `/shops/${id}`)
        .then(({ deletedShopId }) => {
          commit('deleteShop', deletedShopId, { module: 'shop' });
        })
        .catch((err) => {
          console.error(err);
          commit('updateError', err.message, { module: 'shop' });
        });
    },
  },
  namespaced: true,
};
