const express = require('express');
const mongoose = require('mongoose');
const process = require('process');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT);
