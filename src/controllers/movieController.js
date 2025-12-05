const { movieModel } = require('../models/moviesModel');

exports.listMovies = (req, res) => {
    movieModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

exports.readMovie = (req, res) => {
    movieModel.findById(req.params.id)
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

exports.createMovie = (req, res) => {
    const movie = new movieModel(req.body);
    movie.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateMovie = (req, res) => {
    movieModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
    movieModel.findByIdAndDelete(req.params.id)
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
    movieModel.findOne()
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

    movieModel.find()
        .where('actors').equals(actor)
        .where('year').gte(startYear).lte(endYear)
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}
