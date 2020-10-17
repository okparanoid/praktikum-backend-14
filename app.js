const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/cards', cards);
app.use('/users', users);

app.use((req, res) => {
  res.status('404');
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
