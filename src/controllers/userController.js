const { userModel } = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, validateToken} = require('../services/authorizationService');

exports.listUsers = (req, res) => {
    userModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

exports.getUser = (req, res) => {
    userModel.findById(req.params.id)
        .then(doc => {
            console.log(doc);
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
    //console.log(user);
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
                console.log("N "+doc.password+", O "+oldPassword);
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
    
    console.log("user: "+user+", req.userInfo.id "+req.userInfo.id);   
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
    user = await getUser(req.body.emailOrName, req.body.password);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
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
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    try {
        const decodedInfo = validateToken(refreshToken);
        const user = await userModel.findById(decodedInfo.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token session' });
        }
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
    } catch (err) {
        return res.status(403).send("Token expired or invalid");
    }
}

exports.logoutUser = (req, res) => {
    userModel.findByIdAndUpdate(req.userInfo.id, {refreshToken: null})
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
/*
exports.updateMovie = (req, res) => {
    userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Movie not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteMovie = (req, res) => {
    userModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Movie not found');
            }
            res.json({ message: 'Movie deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findBestMovie = (req, res) => {
    userModel.findOne()
        .where('_id').equals('5692a15524de1e0ce2dfcfa3')
        // .sort({ released: -1 })
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findMoviesByActorAndYearRange = (req, res) => {
    const { actor, startYear, endYear } = req.query;

    if (!actor || !startYear || !endYear) {
        return res.status(400).send('Missing query parameters');
    }

    userModel.find()
        .where('actors').equals(actor)
        .where('year').gte(startYear).lte(endYear)
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}
        */
