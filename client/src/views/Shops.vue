<template>
  <div class="wrapper">
    <v-data-table
      :headers="headers"
      :items="shop.shops"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Shops</v-toolbar-title>
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
              >New Shop</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <p class="error" v-if="shop.error">{{ shop.error }}</p>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.name"
                        label="Shop Name"
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
          @click="editShop(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteShop(item)">
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
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Updated At', value: 'updatedAt', align: 'center' },
      { text: 'Created At', value: 'createdAt', align: 'center' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedUserId: '',
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),
  computed: {
    ...mapState(['shop']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Shop' : 'Edit Shop';
    },
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line
      val || this.close();
    },
  },
  mounted() {
    this.$store.dispatch('shop/fetchShops');
  },
  methods: {
    editShop(item) {
      this.editedIndex = this.shop.shops.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteShop(item) {
      // eslint-disable-next-line
      const confirmation = confirm('Are you sure you want to delete this shop?');
      // eslint-disable-next-line
      this.$store.dispatch('shop/deleteShop', item._id);
    },

    close() {
      this.$store.commit('shop/updateError', null);
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.$store.dispatch('shop/updateShop', this.editedItem);
      } else {
        await this.$store.dispatch('shop/createShop', this.editedItem);
      }
      if (!this.shop.error) {
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
