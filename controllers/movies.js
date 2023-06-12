const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const IdError = require('../errors/IdError');

const { invalidData, elementNotFound, accessError } = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((card) => card.populate(['owner']))
    .then((movie) => res.status(201).send(movie))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(invalidData));
      } else {
        next(e);
      }
    });
};
const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм ${elementNotFound}`);
      } else if (movie.owner.valueOf() !== req.user._id) {
        throw new IdError(accessError);
      } else {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch((e) => {
            next(e);
          });
      }
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequestError(invalidData));
      } else {
        next(e);
      }
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
