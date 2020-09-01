const { model, Schema } = require('mongoose');

const ShopSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: /[\w ]+/,
  },
}, { timestamps: true });

module.exports = model('Shop', ShopSchema);
