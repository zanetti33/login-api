const express = require('express');
const mongoose = require('mongoose');
const movieRouter = require('./src/routes/movieRoutes');
const cors = require('cors');
// env variable set from docker-compose.yaml to access the database container
const dbUri = process.env.MONGO_URI;
const connectionString = dbUri || 'mongodb://localhost:27017/dbMovies';

mongoose.connect(connectionString);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/movies', movieRouter);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
