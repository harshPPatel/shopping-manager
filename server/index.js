require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('./db');
const AuthRouter = require('./Auth/Auth.index');
const UserRouter = require('./User/User.index');
const ProductRouter = require('./Products/Products.index');
const ShopsRouter = require('./Shops/Shops.index');
const AuthMiddlewares = require('./Middlewares/Auth.middleware');
const ErrorHandlerMiddlewares = require('./Middlewares/Errors.middlewares');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

db.getConnection(app);

app.on('dbConnected', () => {
  require('./Scripts/CreateAdmin.script');
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API for shopping manager!',
  });
});

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/users', AuthMiddlewares.userIsLoggedIn, AuthMiddlewares.userIsAdmin, UserRouter);
app.use('/api/v1/products', AuthMiddlewares.userIsLoggedIn, ProductRouter);
app.use('/api/v1/shops', AuthMiddlewares.userIsLoggedIn, AuthMiddlewares.userIsAdmin, ShopsRouter);

app.use(ErrorHandlerMiddlewares.notFoundHanlder);
app.use(ErrorHandlerMiddlewares.errorHandler);

app.listen(PORT, () => {
  console.log(`Started application sucessfully at http://localhost:${PORT}!`);
});
