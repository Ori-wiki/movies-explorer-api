const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../errors/AuthError');

const {
  wrongUrlFormat,
  wrongEmailOrPassword,
  minLength,
  maxLength,
  mustFilled,
} = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, `${minLength} "name" - 2`],
      maxlength: [30, `${maxLength} "name" - 30`],
      required: [true, `Поле "name" ${mustFilled}`],
    },
    email: {
      type: String,
      unique: true,
      required: [true, `Поле "email" ${mustFilled}`],
      validate: {
        validator: (v) => isEmail(v),
        message: wrongUrlFormat,
      },
    },
    password: {
      type: String,
      required: [true, `Поле "password" ${mustFilled}`],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function ({ email, password }) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError(wrongEmailOrPassword));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError(wrongEmailOrPassword));
        }
        return user;
      });
    });
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
