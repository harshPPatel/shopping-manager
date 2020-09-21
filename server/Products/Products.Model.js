const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  name: {
    type: String,
    trim: true,
    match: /[\w ]+/,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
  shops: [String],
  quantities: {
    [process.env.STORE1]: {
      type: Number,
      default: 0,
    },
    [process.env.STORE2]: {
      type: Number,
      default: 0,
    },
    [process.env.STORE3]: {
      type: Number,
      default: 0,
    },
  },
}, { timestamps: true });

module.exports = model('Product', ProductSchema);
