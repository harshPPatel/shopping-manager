<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense v-if="user.isLoggedIn">
        <v-list-item link to="/products">
          <v-list-item-content>
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/users" v-if="user.isAdmin">
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/shops" v-if="user.isAdmin">
          <v-list-item-content>
            <v-list-item-title>Shops</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/shopping-list" v-if="user.isAdmin">
          <v-list-item-content>
            <v-list-item-title>Shopping List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="dark"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <b>Shopping Manager 🛒</b>
      </div>

      <v-spacer></v-spacer>

      <v-btn text @click="logout()" v-if="user.isLoggedIn">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import API from './API';
import { REQUEST_METHODS } from './config';

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapState(['user']),
  },
  async mounted() {
    const { token } = localStorage;
    if (token && typeof token === 'string') {
      await API(REQUEST_METHODS.POST, '/auth/validatetoken')
        .then((res) => {
          this.$store.dispatch('user/setAsLoggedIn', res);
        })
        .catch(() => {
          this.$store.dispatch('user/logout');
        });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push('/');
    },
  },
};
</script>
