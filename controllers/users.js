const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const MangoEmailError = require('../errors/MangoEmailError');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

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
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else if (e.code === 11000) {
        next(new MangoEmailError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(e);
      }
    });
};

const getUserInfo = (req, res, next) => {
  console.log('qwe');
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы неправильные данные'));
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
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы неправильные данные'));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
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
      }
    })
    .catch(next);
};
const singout = (req, res) => res.cookie('jwt', { expires: Date.now() }).send({ message: 'Токен удалён' });

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  login,
  singout,
};
