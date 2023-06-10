require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const process = require('process');
const cors = require('cors');
const auth = require('./routes/auth');
const users = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.use('/', auth);
app.use('/', users);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
