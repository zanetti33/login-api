const { get } = require('mongoose');
const { userModel } = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, refreshDuration, accessDuration } = require('../services/authorizationService');

exports.listUsers = (req, res) => {
    userModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

/*
exports.readMovie = (req, res) => {
    userModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Movie not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}*/

exports.createUser = (req, res) => {
    const movie = new userModel(req.body);
    console.log(movie);
    console.log(movie.name);
    if (!movie.email || !movie.password || !movie.name) { //non penso funzioni così qui
        return res.status(400).send('Missing parameters')
    }
    movie.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(409).send('User already registered');
        });
}

exports.updatePassword = (req, res) => {}
exports.updateImage = (req, res) => {}
exports.loginUser = (req, res) => {
    // 1. Authenticate User (Mocked)
    console.log(req);
    const user = getUser(req.body.emailOrName, req.body.password);

    // 2. Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 3. Send Refresh Token as HttpOnly Cookie (Security Best Practice)
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // JavaScript cannot access this (Prevents XSS)
        secure: true,   // HTTPS only (use false for localhost testing)
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // 4. Send Access Token as JSON
    res.json({ 
        "accessToken": accessToken, 
        "expiresIn": 1 * 60 * 60, // 1 hour in seconds
        "tokenType": "Bearer"
    });
}

getUser = (emailOrName, password) => {
    return { id: 'user_123', role: 'admin' };
}

exports.refreshToken = (req, res) => {}
exports.logoutUser = (req, res) => {}
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
