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

exports.updatePassword = (req, res) => {
    const user = userModel.findById("693c31e46a311353ac2b8d2a");
    const oldPassword = (req.body.oldPassword);
    const newPassword = (req.body.newPassword);
    if (user.password != oldPassword) {
        return res.status(403).send('Old password incorrect.')
    }

    user.password = newPassword;
    user.save()
        .then(doc => {
            res.json(doc);
            res.status(200).send('Password updated correctly.');
        })
        .catch(err => {
            res.status(409).send('User already registered');
        });
    
}


exports.updateImage = (req, res) => {
    const user = userModel.findById("693c31e46a311353ac2b8d2a");
    const image = (req.body.imageUrl);
    user.imageUrl = image;
    user.save()
        .then(doc => {
            res.json(doc);
            res.status(200).send('Image updated correctly.');
        })
        .catch(err => {
            res.status(500).send(err);
        });
}


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
