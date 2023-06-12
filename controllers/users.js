const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

const {
  invalidData,
  emailAlreadyRegistered,
  elementNotFound,
  userAlreadyExists,
  tokenDelete,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(invalidData));
      } else if (e.code === 11000) {
        next(new ConflictError(emailAlreadyRegistered));
      } else {
        next(e);
      }
    });
};
const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь ${elementNotFound}`);
      }
      res.send(user);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequestError(invalidData));
      } else {
        next(e);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь ${elementNotFound}`);
      }
      res.send(user);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(invalidData));
      } else if (e.code === 11000) {
        next(new ConflictError(userAlreadyExists));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send(user.toJSON());
      // res.status(200).send({
      //   token: jwt.sign(
      //     { _id: user._id },
      //     NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
      //     {
      //       expiresIn: '7d',
      //     },
      //   ),
      // });
    })
    .catch(next);
};
const singout = (req, res) => res.cookie('jwt', { expires: Date.now() }).send({ message: tokenDelete });

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  login,
  singout,
};
