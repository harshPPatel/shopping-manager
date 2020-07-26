const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('./db');
const AuthRouter = require('./Auth/Auth.index');
const ErrorHandlerMiddlewares = require('./Middlewares/Errors.Middlewares');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(morgan('dev'));

db.getConnection(app);

app.on('dbConnected', () => {
  require('./Scripts/CreateAdmin.script');
})

app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to the API for shopping manager!',
  });
});

app.use('/api/v1/auth', AuthRouter);

app.use(ErrorHandlerMiddlewares.notFoundHanlder);
app.use(ErrorHandlerMiddlewares.errorHandler);

app.listen(PORT, () => {
  console.log(`Started application sucessfully at http://localhost:${PORT}!`);
});
