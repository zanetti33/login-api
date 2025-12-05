const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rated: String,
    released: Date,
    runtime: Number,
    countries: [String],
    genres: [String],
    director: String,
    writers: [String],
    actors: [String],
    plot: String,
    poster: String,
    imdb: {
        id: String,
        rating: Number,
        votes: Number
    },
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    type: String
});

const movieModel = mongoose.model('Movie', movieSchema)

module.exports = { movieModel }
