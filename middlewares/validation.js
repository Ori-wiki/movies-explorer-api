const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const BadRequestError = require('../errors/BadRequestError');

const { wrongUrlFormat, wrongLanguage, invalidData } = require('../utils/constants');

const regex = /^(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/im;
const en = /^[-a-zA-Z0-9@:%._+~#=/ ]+$/;
const ru = /^[а-яА-ЯЁё0-9@:%._+~#=/ ]+$/;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(30),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    name: Joi.string().min(2).max(30),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string()
      .required()
      .custom((value) => {
        if (!regex.test(value)) {
          throw new BadRequestError(wrongUrlFormat);
        }
        return value;
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value) => {
        if (!regex.test(value)) {
          throw new BadRequestError(wrongUrlFormat);
        }
        return value;
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value) => {
        if (!regex.test(value)) {
          throw new BadRequestError(wrongUrlFormat);
        }
        return value;
      }),
    movieId: Joi.number().required(),
    nameRU: Joi.string()
      .required()
      .min(2)
      .max(30)
      .custom((value) => {
        if (!ru.test(value)) {
          throw new BadRequestError(`${wrongLanguage} на русском`);
        }
        return value;
      }),
    nameEN: Joi.string()
      .required()
      .min(2)
      .max(30)
      .custom((value) => {
        if (!en.test(value)) {
          throw new BadRequestError(`${wrongLanguage} на английском`);
        }
        return value;
      }),
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
