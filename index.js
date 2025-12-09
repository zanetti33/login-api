const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const movieRouter = require('./src/routes/movieRoutes');
const cors = require('cors');

// env variable set from docker-compose.yaml to access the database container
const connectionString =  process.env.MONGO_URI || 'mongodb://localhost:27017/dbMovies';
// env variable set from docker-compose.yaml to access set the service port
const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

mongoose.connect(connectionString);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/movies', movieRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});
