require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { limiter } = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT, NODE_ENV, MONGO_URL, MONGO_URL_DEV,
} = require('./utils/config');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors);
app.use(cookieParser());
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
