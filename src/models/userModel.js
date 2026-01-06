const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    isAdmin: {type: Boolean, default: false},
    imageUrl: String,
    refreshToken: String
}, {
    versionKey: false,
    // When calling toJSON, remove sensitive info
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.refreshToken;
            delete ret.password;
            return ret;
        }
    }
});

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel }
