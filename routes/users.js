const router = require('express').Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch('/users/me', updateUserInfo);

module.exports = router;
