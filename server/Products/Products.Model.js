const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  name: {
    type: String,
    trim: true,
    match: /^\S+$/,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
  shops: [String],
}, { timestamps: true });

module.exports = model('Product', ProductSchema);
