const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
