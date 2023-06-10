require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const cors = require('cors');

// const users = require('./routes/users');
const { createUser } = require('./controllers/users');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.post('/signup', createUser);

app.listen(PORT);
