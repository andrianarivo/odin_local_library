const path = require('path');
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

// Connect to MongoDB Atlas
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const mongoDB = 'mongodb+srv://andrianarivodavid:ABEXaT2JnrS7Txaw@cluster0.sjxvp7u.mongodb.net/?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.error(err));

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();

// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
