const fs = require('fs');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/userModel');
const privateKey = fs.readFileSync('./private.pem', 'utf8');
const publicKey = fs.readFileSync('./public.pem', 'utf8');
const algorithm = 'RS256';
const accessDuration = '1h';
const refreshDuration = '30d';

exports.validateToken = (token) => {
    console.log("Validating token:", token);
    const decoded = jwt.verify(token, publicKey, { 
        algorithms: [algorithm],
        iss: 'login-api'
    });
    console.log("Decoded token:", decoded);
    return decoded.user;
}

generateToken = (user, duration) => {
    const payload = {
        user: user,
        iss: 'login-api' 
    };
    // SIGNING
    // We use RS256 (Asymmetric)
    const token = jwt.sign(payload, privateKey, { 
        algorithm: algorithm, 
        expiresIn: duration
    });
    return token;
}

exports.generateAccessToken = (user) => {
    return generateToken(user, accessDuration);
}

exports.generateRefreshToken = (user) => {
    const token = generateToken(user, refreshDuration);
    userModel.findByIdAndUpdate(user._id, { refreshToken: token });
    return token;
}