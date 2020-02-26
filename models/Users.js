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
  password_change_at: {
    type: Date,
    defalut: null
  }
});


UserSchema.methods.changedPasswordAfter = (jwtTimestamp) => {
  if (this.password_change_at) {
    const changedTimestamp = parseInt(this.password_change_at.getTime() / 1000, 10);

    return jwtTimestamp < changedTimestamp;
  }

  //Not changed
  return false;
}


module.exports = Users = mongoose.model('users', UserSchema)