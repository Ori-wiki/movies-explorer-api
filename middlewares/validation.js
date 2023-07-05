const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const BadRequestError = require('../errors/BadRequestError');

const { wrongUrlFormat, invalidData } = require('../utils/constants');

const regex = /^(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/im;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(40),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(40),
    name: Joi.string().min(2).max(30),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    email: Joi.string().required().email(),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(200),
    director: Joi.string().required().min(2).max(200),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required(),
    trailerLink: Joi.string()
      .required()
      .custom((value) => {
        if (!regex.test(value)) {
          throw new BadRequestError(wrongUrlFormat);
        }
        return value;
      }),
    id: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
  }),
});
const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string()
      .required()
      .custom((value) => {
        if (!ObjectId.isValid(value)) {
          throw new BadRequestError(invalidData);
        }
        return value;
      }),
  }),
});

module.exports = {
  signUpValidation,
  signInValidation,
  updateUserValidation,
  createMovieValidation,
  deleteMovieValidation,
};
