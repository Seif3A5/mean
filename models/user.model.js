var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true

    },
    password: {
        type: String,
        required: true,
        minlength: 6

    },
    role: String,
    coordinates: {
        alt: Number,
        lg: Number
    },
    status: Boolean
});

module.exports = mongoose.model('users', User);

