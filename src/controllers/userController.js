const { userModel } = require('../models/userModel');

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

exports.updatePassword = (req, res) => {}
exports.updateImage = (req, res) => {}
exports.loginUser = (req, res) => {}
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
