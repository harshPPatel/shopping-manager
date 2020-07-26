const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 15,
    unique: true,
    match: /(^[a-zA-Z0-9_]+$)/,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = model('User', UserSchema);
