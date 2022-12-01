require('dotenv').config();

const express = require('express');

const path = require('path');

const { ValidationError } = require('express-validation');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const cors = require('cors');

const compression = require('compression');

const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOption = require('./swagger-config.json');

const connectToDB = require('./database');

const applicationMode = process.env.MODE;

const {
  userRoute,
  authRoute,
  postRoute,
  commentRoute,
  categoryRoute,
} = require('./routes/v1');

const app = express();

const MONGODB_URL = process.env.MONGODB_URL || null;

const port = process.env.PORT || 8080;

app.use(compression({ level: 9, threshold: 0 }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home', {
    title: 'API Server',
    message: 'Running',
  });
});

if (applicationMode === 'production' || applicationMode === 'development') {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
  );
}

app.use(bodyParser.json());

app.use('/v1/user', userRoute);

app.use('/v1/auth', authRoute);

app.use('/v1/post', postRoute);

app.use('/v1/comment', commentRoute);

app.use('/v1/category', categoryRoute);

const openapiSpecification = swaggerJsdoc(swaggerOption);

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use((err, req, res) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

module.exports = app.listen(port, async () => {
  if (MONGODB_URL) {
    await connectToDB(MONGODB_URL, applicationMode);
  }
  if (applicationMode === 'development') console.log(`app is listening on port ${port}`);
});
