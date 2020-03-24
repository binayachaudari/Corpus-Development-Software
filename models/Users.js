const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['Admin', 'Developer', 'Linguist', 'Reviewer'],
      message: 'Invalid Role, valid roles include [Admin, Developer, Linguist, Reviewer]'
    },
    required: true
  },
  activated: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    defalut: Date.now
  },
  password_reset_token: {
    type: String,
    select: false
  },
  password_reset_expires: {
    type: Date,
    select: false
  }
});

module.exports = Users = mongoose.model('users', UserSchema)