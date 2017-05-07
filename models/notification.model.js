var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
    message: String,
    info: String,
    username: String,
    coordinates: {
        alt: Number,
        lg: Number
    },
    reparateur_id: String,
    status: String
});

module.exports = mongoose.model('notifications', Notification);

