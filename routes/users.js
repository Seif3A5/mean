var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Users = mongoose.model('users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('users');
});


router.get('/:lat/:lng', function (req, res, next) {

    Users.find({location: {$near: [req.params.lat, req.params.lng], $maxDistance: 0.1}}, function (err, results) {
        res.json(results);
    });

});


module.exports = router;
