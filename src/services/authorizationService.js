const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { userModel } = require('../models/userModel');
const privateKey = fs.readFileSync('./private.pem', 'utf8');
const publicKey = fs.readFileSync('./public.pem', 'utf8');
const isDebug = process.env.NODE_ENV == 'debug';
const algorithm = 'RS256';
const accessDuration = '1h';
const refreshDuration = '30d';
const issuer = 'login-api';
const SECRET = process.env.PASSWORD_SECRET || 'R0s3SArER3d&v10lEtSAR3blU3';
exports.publicKey = publicKey;

exports.validateToken = (token) => {
    const decoded = jwt.verify(token, publicKey, { 
        algorithms: [algorithm],
        iss: issuer
    });
    // Here we can return whatever info we need from the token
    // we are currently putting it in req.userInfo in the middleware
    return {
        id: decoded.sub,
        isAdmin: decoded.roles.includes('admin'),
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
        iss: issuer
    };
    if (isDebug) {
        console.log(payload);
    }
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

exports.generateRefreshToken = async (user, oldToken = null) => {
    const newToken = generateToken(user, refreshDuration);
    if (oldToken) {
        const result = await userModel.findOneAndUpdate(
            { 
                _id: user._id, 
                refreshToken: oldToken // <--- The Concurrency Lock
            },
            { refreshToken: newToken },
            { new: true }
        );
        if (!result) {
            throw new Error("Token Reuse Detected");
        }
    } else {
        await userModel.findByIdAndUpdate(user._id, { refreshToken: newToken });
    }
    return newToken;
}

exports.validatePassword = async (user, password) => {
    return await bcrypt.compare(password + SECRET, user.password);
}

exports.hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password + SECRET, saltRounds);
}