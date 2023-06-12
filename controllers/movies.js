const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const IdError = require('../errors/IdError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
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
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
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
        throw new NotFoundError('Фильм не найден');
      } else if (movie.owner.valueOf() !== req.user._id) {
        throw new IdError('Можно удалять только свои фильмы');
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
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
