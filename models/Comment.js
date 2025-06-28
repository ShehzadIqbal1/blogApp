const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
