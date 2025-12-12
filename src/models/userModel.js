const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    password: String,
    email: String,
    isAdmin: Boolean,
    imageUrl: String
});

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel }
