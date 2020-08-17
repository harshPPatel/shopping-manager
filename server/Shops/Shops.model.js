const { model, Schema } = require('mongoose');

const ShopSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: /^\S+$/,
  },
}, { timestamps: true });

module.exports = model('Shop', ShopSchema);
