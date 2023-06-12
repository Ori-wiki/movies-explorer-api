const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { authorizationRequired, userNotAuthorization } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

// const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return next(new AuthError('Пользователь не авторизован!'));
  // }
  // const token = extractBearerToken(authorization);
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthError(authorizationRequired));
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return next(new AuthError(userNotAuthorization));
  }

  req.user = payload;

  return next();
};
