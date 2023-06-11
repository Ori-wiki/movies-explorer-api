const Movie = require('../models/movie');

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
        next(new Error('Переданы некорректные данные'));
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
        throw new Error('Фильм не найден');
      } else if (movie.owner.valueOf() !== req.user._id) {
        throw new Error('Можно удалять только свои фильмы');
      } else {
        Movie.findByIdAndRemove(_id)
          .then((deletedMovie) => {
            res.send(deletedMovie);
          })
          .catch((e) => {
            next(e);
          });
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new Error('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
