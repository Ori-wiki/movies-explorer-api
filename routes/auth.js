const router = require('express').Router();

const { createUser, login, singout } = require('../controllers/users');
const { signUp, signIn } = require('../middlewares/validation');

router.post('/signup', signUp, createUser);
router.post('/signout', singout);
router.post('/signin', signIn, login);

module.exports = router;
