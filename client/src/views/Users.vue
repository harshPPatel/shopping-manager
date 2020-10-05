<template>
  <div class="wrapper">
    <v-data-table
      :headers="headers"
      :items="user.users"
      sort-by="username"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                v-if="user.isAdmin"
              >New User</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <p class="error" v-if="user.authError">{{ user.authError }}</p>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.newUsername"
                        label="Username"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        hint="At least 6 characters"
                        counter
                        @click:append="showPassword = !showPassword"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Users',
  data: () => ({
    dialog: false,
    showPassword: false,
    headers: [
      { text: 'Username', value: 'username', align: 'center' },
      { text: 'Updated At', value: 'updatedAt', align: 'center' },
      { text: 'Created At', value: 'createdAt', align: 'center' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedUserId: '',
    editedItem: {
      username: '',
      password: '',
      newUsername: '',
    },
    defaultItem: {
      username: '',
      password: '',
    },
  }),
  computed: {
    ...mapState(['user']),
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User';
    },
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line
      val || this.close();
    },
  },
  mounted() {
    this.$store.dispatch('user/fetchUsers');
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.user.users.indexOf(item);
      this.editedItem.username = item.username;
      this.editedItem.newUsername = item.username;
      this.editedItem.password = item.password;
      this.dialog = true;
    },

    deleteItem(item) {
      // eslint-disable-next-line
      const confirmation = confirm('Are you sure you want to delete this user?');
      // dispatch method to delete user
      this.$store.dispatch('user/deleteUser', item.username);
    },

    close() {
      this.$store.commit('user/updateAuthError', null);
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.$store.dispatch('user/updateUser', this.editedItem);
      } else {
        const newUser = {
          username: this.editedItem.newUsername,
          password: this.editedItem.password,
        };
        await this.$store.dispatch('user/createUser', newUser);
      }
      if (!this.user.authError) {
        this.close();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 80%;
  max-width: 980px;
  margin: 60px auto 0;
}

.error {
  max-width: 80%;
  margin: 0 auto;
  padding: 10px;
  color: white;
}
</style>
