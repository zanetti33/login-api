const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    isAdmin: {type: Boolean, default: false},
    imageUrl: String
}, {
    versionKey: false
});

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel }
