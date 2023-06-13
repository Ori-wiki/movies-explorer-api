const router = require('express').Router();

const { createUser, login, singout } = require('../controllers/users');
const { signUpValidation, signInValidation } = require('../middlewares/validation');

router.post('/signup', signUpValidation, createUser);
router.post('/signout', singout);
router.post('/signin', signInValidation, login);

module.exports = router;
