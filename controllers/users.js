const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

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
        next(new Error('Переданы неверные данные'));
      } else if (e.code === 11000) {
        next(new Error('Пользователь с таким email уже зарегистрирован'));
      } else {
        console.log(e);
      }
    });
};

const getUserInfo = (req, res, next) => {
  console.log(req.user);
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        console.log('пользователь не найден');
        return;
      }
      res.send(user);
    })
    .catch((e) => {
      console.log(e);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        console.log('пользователь не найден');
        return;
      }
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new Error('Переданы неправильные данные'));
      } else {
        console.log(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      } else {
        res.status(200).send({
          token: jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            {
              expiresIn: '7d',
            },
          ),
        });
      }
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  login,
};
