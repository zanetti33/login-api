const fs = require('fs');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/userModel');
const privateKey = fs.readFileSync('./private.pem', 'utf8');
const publicKey = fs.readFileSync('./public.pem', 'utf8');
const algorithm = 'RS256';
const accessDuration = '1h';
const refreshDuration = '30d';
exports.publicKey = publicKey;

exports.validateToken = (token) => {
    const decoded = jwt.verify(token, publicKey, { 
        algorithms: [algorithm],
        iss: 'login-api'
    });
    // Here we can return whatever info we need from the token
    // we are currently putting it in req.userInfo in the middleware
    return {
        id: decoded.sub,
        isAdmin: decoded.roles.contains('admin'),
        name: decoded.name,
        imageUrl: decoded.imageUrl
    };
}

generateToken = (user, duration) => {
    // Here we decide what data to store in the token
    // sub, roles and iss are standard claims
    const payload = {
        sub: user.id,
        roles: user.isAdmin ? ['admin'] : ['user'],
        name: user.name,
        imageUrl: user.imageUrl,
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