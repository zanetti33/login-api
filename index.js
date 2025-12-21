const express = require('express');
const mongoose = require('mongoose');
const protectedRouter = require('./src/routes/protectedRouter');
const publicRouter = require('./src/routes/publicRouter');
const authorizationMiddleware = require('./src/middlewares/authorizationMiddleware');
const cors = require('cors');
const YAML = require('yamljs');
const path = require('path');
const cookieParser = require('cookie-parser');

// env variable set from docker-compose.yaml to access the database container
const connectionString =  process.env.MONGO_URI || 'mongodb://localhost:27017/login';
// env variable set from docker-compose.yaml to access set the service port
const port = process.env.PORT || 3000;
// env variable to check if we are in development mode
const isDev = process.env.NODE_ENV == 'development';
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));
const swaggerUi = require('swagger-ui-express');

mongoose.connect(connectionString);

const app = express();
// Debugging middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] Request received: ${req.method} ${req.originalUrl}`);
    next();
});
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Public API routes
app.use('/', publicRouter);

// Authorization middleware
if (!isDev) {
    app.use(authorizationMiddleware.authorize);
}

// Protected API routes
app.use('/', protectedRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});
