const router = require('express').Router();
const {
  getUsers,
  getUser,
  changeUserInfo,
  changeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', changeUserInfo);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
