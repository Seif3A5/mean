'use strict';
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var mongoose = require('mongoose');
var Users = mongoose.model('users');
var Notifications = mongoose.model('notifications');
var express = require('express');
var router = express.Router();

//Get quiz from session
var mockQuiz = {
    object: "Outils de jardinage.",
    userContact: "user@gmail.com"
};


var selfSignedConfig = {
    service: "gmail",
    secure: false,
    port: 25,
    auth: {
        user: 'seyf.chakrooun@gmail.com',
        pass: 'artasartas147123'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(selfSignedConfig);

router.post("/", function (req, res, next) {
    console.log(req.body);


    var notif = new Notifications({
        message: req.body.message,
        info: req.body.info,
        username: req.body.username,
        coordinates: {
            alt: req.body.location.split(",")[0],
            lg: req.body.location.split(",")[1]
        },
        status: "En Cours"
    });

    console.log(notif.save());

    Users.findById(req.body.reparateur, function (err, user) {
        console.log(user);

        //req.session.quiz.object
        //req.session.quiz.contact


        var mailOptions = {
            from: 'seyf.chakrooun@gmail.com', // sender address
            to: user.email, // list of receivers
            subject: 'Notification de ' + req.body.username, // Subject line
            html: '<b>Un profil (' + req.body.username + ') a besoin de vos services de bricolage</b><br/>' +
            '<b>Object:</b> ' + req.body.message + "<br/>" +
            '<b>Veuillez me contacter:</b> ' + req.body.info
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.json("Error sending mail" + error);
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);

            res.json("OK");
        });
    });
});

/* GET users listing. */
router.get('/', function (req, res, next) {

    Users.findById(req.query.id, function (err, user) {
        console.log(user);

        //req.session.quiz.object
        //req.session.quiz.contact


        var mailOptions = {
            from: 'seifeddine.chakroun@esprit.tn', // sender address
            to: user.email, // list of receivers
            subject: 'Notification', // Subject line
            html: '<b>Un profil a besoin de vos services de bricolage</b><br/>' +
            '<b>Object:</b> ' + mockQuiz.object + "<br/>" +
            '<b>Veuillez me contacter:</b> ' + mockQuiz.userContact
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.json("Error sending mail" + error);
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);

            res.json("Mail sent successfully");
        });
    });
});

module.exports = router;