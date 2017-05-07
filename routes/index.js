var _ = require("lodash");
var express = require("express");
var router = express.Router();

var mongoose = require('mongoose');
var Users = mongoose.model('users');
var Notifications = mongoose.model('notifications');
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'espritsecretkey';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:

    Users.findById(jwt_payload.id, function (err, user) {
        if (user && !err) {
            next(null, user);
        } else {
            next(null, false);
        }
    });

});

passport.use(strategy);


router.use(passport.initialize());

router.get('/', function (req, res, next) {
    res.render('home', {title: 'Express'});
});
router.get('/service', function (req, res, next) {
    res.render('service', {title: 'Express'});
});

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
router.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
router.use(bodyParser.json());

router.post("/login", function (req, res) {
    if (req.body.username && req.body.password) {
        var name = req.body.username;
        var password = req.body.password;
    }
    // usually this would be a database call:

    Users.findOne({'username': name}, function (err, user) {
        if (err || !user) {
            res.status(401).json({message: "no such user found"});
            return;
        }

        //console.log(user);

        if (user.password === req.body.password) {
            // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
            var payload = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            };
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
        } else {
            res.status(401).json({message: "passwords did not match"});
        }
    });
});

router.get("/loggedin", passport.authenticate('jwt', {session: false}), function (req, res) {
    res.json({message: "loggedin"});
});

router.get("/current", passport.authenticate('jwt', {session: false}), function (req, res) {
    res.json(req.user);
});


router.put("/status/:status", passport.authenticate('jwt', {session: false}), function (req, res) {

    Users.update({ _id: req.user._id }, { $set: { status: req.params.status }}, function () {
        console.log("Done updating...");
        req.user.status = req.params.status;
    });

    res.end();
});

router.get("/notifications", passport.authenticate('jwt', {session: false}), function (req, res) {

    Notifications.find({reparateur_id: req.user.id}, function (err, notifications) {
        if (err) {
            res.json("error");

            return;
        }
        console.log("notf", notifications);
        res.json(notifications);
        return;
    });
});

module.exports = router;