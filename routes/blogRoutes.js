const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likestatusPost
} = require('../controllers/blogPostController');



router.get('/', getAllPost);
router.get('/:id', getPostById);

router.post('/', auth, roleCheck(['author']), createPost);
router.put('/:id', auth, roleCheck(['author']), updatePost);

//  Author OR Admin
router.delete('/:id', auth, deletePost);

router.patch('/likestatusPost/:postId', auth, roleCheck(['reader']), likestatusPost)

router.post('/:postId', auth, likestatusPost);

module.exports = router;
