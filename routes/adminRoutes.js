const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const {
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');


router.use(auth, roleCheck(['admin']));

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
