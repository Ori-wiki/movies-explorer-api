const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const { wrongUrlFormat, mustFilled } = require('../utils/constants');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, `Поле "country" ${mustFilled}`],
    },
    director: {
      type: String,
      required: [true, `Поле "director" ${mustFilled}`],
    },
    duration: {
      type: Number,
      required: [true, `Поле "duration" ${mustFilled}`],
    },
    year: {
      type: String,
      required: [true, `Поле "year" ${mustFilled}`],
    },
    description: {
      type: String,
      required: [true, `Поле "description" ${mustFilled}`],
    },
    image: {
      type: String,
      validate: {
        validator: (v) => isURL(v),
        message: wrongUrlFormat,
      },
      required: [true, `Поле "image" ${mustFilled}`],
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (v) => isURL(v),
        message: wrongUrlFormat,
      },
      required: [true, `Поле "trailerLink" ${mustFilled}`],
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (v) => isURL(v),
        message: wrongUrlFormat,
      },
      required: [true, `Поле "thumbnail" ${mustFilled}`],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, `Поле "owner" ${mustFilled}`],
    },
    movieId: {
      type: Number,
      required: [true, `Поле "movieId" ${mustFilled}`],
    },
    nameRU: {
      type: String,
      required: [true, `Поле "nameRU" ${mustFilled}`],
    },
    nameEN: {
      type: String,
      required: [true, `Поле "nameEN" ${mustFilled}`],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
