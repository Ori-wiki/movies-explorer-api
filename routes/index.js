const router = require('express').Router();

const autoAuth = require('../middlewares/auth');
const auth = require('./auth');
const users = require('./users');
const movies = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

router.use('/', auth);
router.use(autoAuth);

router.use('/', users);
router.use('/', movies);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;
