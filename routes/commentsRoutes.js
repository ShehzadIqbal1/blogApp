const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const {
  createComment,
  getCommentsForPost,
  deleteComment
} = require('../controllers/commentController');


router.post('/:postId', auth, roleCheck(['author', 'reader']), createComment);

// Get all comments for post (Public)
router.get('/:postId', getCommentsForPost);

// Delete comment (Author of comment or Admin)
router.delete('/comment/:commentId', auth, deleteComment);

module.exports = router;
