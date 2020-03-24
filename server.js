const express = require('express');
const app = express();
const morgan = require('morgan');
const connectDB = require('./config/db');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const PORT = process.env.PORT || 5000;

/**
 * Connect to Database
 */
connectDB();


/**
 * Inbuild Middleware
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/**
 * Third-Party Middleware
 */
app.use(helmet());
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(compression());

/**
 * Routing Middleware
 */
app.use('/api', require('./routes/api'));


/**
 * Application Middleware
 */
app.use((req, res, next) => {
  res.status(404);
  next({
    status: 404,
    message: '404 page not found'
  })
})


/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
  res.status(err.status || 400);
  res.json({
    status: err.status,
    message: err.message
  });
});


/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`Server started, listening to port: ${PORT}`);
});