const mongoose = require('mongoose');


const FilesSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  start_index: {
    type: Number,
    required: true
  },
  end_index: {
    type: Number,
    required: true
  },
  translated: {
    type: Boolean,
    default: false
  },
  reviewed: {
    type: Boolean,
    default: false
  }
});

module.exports = Files = mongoose.model('files', FilesSchema);
