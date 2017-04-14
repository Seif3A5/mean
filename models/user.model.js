var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    role: String,
    coordinates:{
    alt: Number,
        lg: Number
}
});

module.exports = mongoose.model('users', User);

