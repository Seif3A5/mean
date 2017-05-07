var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var valid = require('validator');


//var jwt = require ('jsonwebtoken'); //jwt


var mongoose = require('mongoose');
var usersModel = require('./models/user.model');
var notificationsModel = require('./models/notification.model');
var config = require('./config/config');

console.log("connecting...");

mongoose.connect(config.mongo.uri, usersModel, notificationsModel);

var index = require('./routes/index');
var users = require('./routes/users');
var notification = require('./routes/notification');

//var authenticateController = require('./controllers/authenticate-controller'); //jwt


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//process.env.SECRET_KEY= "mybadasskey"; //jwt

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/notification', notification);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

///app.get('/api/authenticate', authenticateController.authenticate);

module.exports = app;
