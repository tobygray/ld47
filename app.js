const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const editorRouter = require('./routes/editor');
const resultsRouter = require('./routes/results');

const app = express();

// Read build info json file if available
fs.readFile('dist/build_info.json', 'utf8', (err, data) => {
  if (err) {
    global.buildInfo = { commit: '<LOCAL>', time: 'now' };
  } else {
    // parse JSON string to JSON object
    global.buildInfo = JSON.parse(data);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (fs.existsSync('public')) {
  // This will exist inside our docker container
  app.use(express.static(path.join(__dirname, 'public')));
} else {
  // For local develoment just assume that the assets directory is checked out above us, it's
  // ugly but this is only one weekend
  app.use(express.static(path.join(__dirname, '../ld47-assets/public')));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/editor', editorRouter);
app.use('/results', resultsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
