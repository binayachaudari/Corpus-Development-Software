const mongoose = require('mongoose');


const FilesSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  source_filename: {
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
  is_translated: {
    type: Boolean,
    default: false
  },
  is_reviewed: {
    type: Boolean,
    default: false
  }
});

module.exports = Files = mongoose.model('files', FilesSchema);
