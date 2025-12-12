const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    isAdmin: Boolean,
    imageUrl: String
}, {
    versionKey: false
});

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel }
