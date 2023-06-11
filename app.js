require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const process = require('process');
const cors = require('cors');
const autoAuth = require('./middlewares/auth');
const auth = require('./routes/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { limiter } = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use('/', auth);
app.use(autoAuth);

app.use('/', users);
app.use('/', movies);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
