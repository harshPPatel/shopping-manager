<template>
  <div class="wrapper">
    <v-data-table
      :headers="headers"
      :items="product.products"
      :search="search"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Products</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            class="search-box"
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                v-if="user.isAdmin"
              >New Item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="Product name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.price"
                        label="Price" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.image" label="Image URL"></v-text-field>
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
      <template v-slot:item.image="{ item }">
        <img class="product-image" :src="item.image" :alt="item.name">
      </template>
      <template v-slot:item.actions="{ item }" v-if="user.isAdmin">
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
import { STORE_NAMES } from '../config';

export default {
  name: 'Products',
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'Product Image',
        value: 'image',
        align: 'center',
        sortable: false,
      },
      { text: 'Product', value: 'name' },
      { text: 'Price', value: 'price', align: 'right' },
      {
        text: STORE_NAMES.STORE1,
        value: `quantities.${STORE_NAMES.STORE1}`,
        align: 'center',
        sortable: false,
      },
      {
        text: STORE_NAMES.STORE2,
        value: `quantities.${STORE_NAMES.STORE2}`,
        align: 'center',
        sortable: false,
      },
      {
        text: STORE_NAMES.STORE3,
        value: `quantities.${STORE_NAMES.STORE3}`,
        align: 'center',
        sortable: false,
      },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedProductId: '',
    editedItem: {
      name: '',
      price: 0,
      image: '',
    },
    defaultItem: {
      name: '',
      price: 0,
      image: '',
    },
  }),
  computed: {
    ...mapState(['user', 'product']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Product' : 'Edit Product';
    },
  },
  watch: {
    dialog(val) {
      // eslint-disable-next-line
      val || this.close();
    },
  },
  mounted() {
    this.$store.dispatch('product/fetchProducts');
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.product.products.indexOf(item);
      // eslint-disable-next-line
      this.editedProductId = item._id;
      this.editedItem.name = item.name;
      this.editedItem.price = item.price;
      this.editedItem.image = item.image;
      this.dialog = true;
    },

    deleteItem(item) {
      // eslint-disable-next-line
      const confirmation = confirm('Are you sure you want to delete this item?');
      this.$store.dispatch('product/deleteProduct', item);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.$store.dispatch('product/updateProduct', {
          id: this.editedProductId,
          item: this.editedItem,
        });
      } else {
        this.$store.dispatch('product/createProduct', this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.product-image {
  height: 60px;
}

.wrapper {
  width: 80%;
  max-width: 980px;
  margin: 60px auto 0;
}

.search-box {
  margin-right: 22px;
}
</style>
