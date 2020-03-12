const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  file_details: {
    type: mongoose.Schema.Types.String,
    ref: 'files'
  },
  status: {
    type: String,
    default: 'assigned'
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  assigned_date: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  submitted_on: {
    type: Date
  },
  is_overdue: {
    type: Boolean,
    default: false
  }
});

module.exports = Review = mongoose.model('review-files', ReviewSchema);