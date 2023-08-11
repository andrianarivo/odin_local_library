const path = require('path');
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const debug = require('debug')('app');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

// Connect to MongoDB Atlas
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// Set up mongoose connection
const devDbUrl = 'mongodb+srv://andrianarivodavid:ABEXaT2JnrS7Txaw@cluster0.sjxvp7u.mongodb.net/test?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || devDbUrl;

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => debug(err));

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ['\'self\'', 'cdn.jsdelivr.net'],
    },
  }),
);

app.use(compression()); // Compress all routes

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
