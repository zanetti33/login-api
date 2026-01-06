const e = require('express');
const { userModel } = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, validateToken} = require('../services/authorizationService');
const isDebug = process.env.NODE_ENV == 'debug';

log = (message) => {
    if (isDebug) {
        console.log(message);
    }
}

exports.listUsers = (req, res) => {
    if (!req.userInfo.isAdmin) {
        return res.status(403).send('Admin privileges required.');
    }
    userModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

exports.getUser = (req, res) => {
    if (!req.userInfo.isAdmin) {
        return res.status(403).send('Admin privileges required.');
    }
    userModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found.');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getMe = (req, res) => {
    userModel.findById(req.userInfo.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found.');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createUser = (req, res) => {
    const user = new userModel(req.body);
    log(user);
    if (!user.email || !user.password || !user.name) {
        return res.status(400).send('Missing parameters');
    }
    user.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.status(409).send('User already registered (Email or Username already exists)');
            }
            if (err.name === 'ValidationError') {
                 return res.status(400).send(err.message);
            }
        });
}

exports.updatePassword = (req, res) => {
    const oldPassword = (req.body.oldPassword);
    const newPassword = (req.body.newPassword);
    const user = userModel.findById(req.userInfo.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            if (doc.password != oldPassword) {
                return res.status(403).send('Old password incorrect.');
            }
            userModel.findByIdAndUpdate(req.userInfo.id, {password: newPassword})
            .then(result => {
                if (!result) {
                    return res.status(404).send('User not found');
                }
                res.json(result);
                })
            .catch(err => {
                res.status(500).send(err);
            })
        })
        .catch(err => {
            res.status(500).send(err);
        });
}


exports.updateImage = (req, res) => {
    userModel.findByIdAndUpdate(req.userInfo.id, {imageUrl: req.body.imageUrl})
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteAccount = (req, res) => {
    userModel.findByIdAndDelete(req.userInfo.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

const getUser = async (identifier, password) => {
    if (!identifier || !password) {
        throw new Error('Missing credentials');
    }

    const user = await userModel.findOne({
        $or: [
            { name: identifier },
            { email: identifier }
        ],
        password: password
    });

    return user;
}

exports.loginUser = async (req, res) => {
    // Fetch User
    if (!req.body.emailOrName || !req.body.password) {
        return res.status(400).send('Missing parameters');
    }
    user = await getUser(req.body.emailOrName, req.body.password);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    log("Successfully logged: " + user);
    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    // Send Refresh Token as HttpOnly Cookie (Security Best Practice)
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,  // Set to true in production with HTTPS
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    // Send Access Token as JSON
    res.json({ 
        "accessToken": accessToken, 
        "expiresIn": 1 * 60 * 60, // 1 hour in seconds
        "tokenType": "Bearer"
    });
}

exports.refreshToken = async (req, res) => {
    // Get refreshToken from cookies
    const incomingRefreshToken = req.cookies.jwt;
    if (!incomingRefreshToken) {
        return res.sendStatus(403);
    }
    try {
        // Validate Token with crypt and database value
        const decodedInfo = validateToken(incomingRefreshToken);
        const user = await userModel.findById(decodedInfo.id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.sendStatus(403);
        }
        // Generate Tokens
        const accessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user);
        // Send Refresh Token as HttpOnly Cookie (Security Best Practice)
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: false,  // Set to true in production with HTTPS
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        // Send Access Token as JSON
        res.json({ 
            "accessToken": accessToken, 
            "expiresIn": 1 * 60 * 60, // 1 hour in seconds
            "tokenType": "Bearer"
        });
    } catch (err) {
        log(err);
        return res.sendStatus(403);
    }
}

exports.logoutUser = (req, res) => {
    userModel.findByIdAndUpdate(req.userInfo.id, {refreshToken: null})
        .then(doc => {
            if (!doc) {
                return res.sendStatus(404);
            }
            res.json(doc);
        })
        .catch(err => {
            res.sendStatus(500);
        });
}
