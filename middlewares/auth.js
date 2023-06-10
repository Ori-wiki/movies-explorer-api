const jwt = require('jsonwebtoken');
// const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Error('Пользователь не авторизован!'));
  }
  // const token = authorization.replace("Bearer ", "");
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new Error('Пользователь не авторизован!'));
  }

  req.user = payload;

  return next();
};
