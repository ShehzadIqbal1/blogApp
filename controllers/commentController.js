const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

const createComment = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  try {
    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      text,
      post: postId,
      user: req.user.userId
    });

    await comment.save();
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Failed to get comments' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (req.user.role !== 'admin' && comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  createComment,
  getCommentsForPost,
  deleteComment
};
