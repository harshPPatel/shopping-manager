const db = require('mongoose');

const URI = process.env.MONGO_URI || 'mongodb://localhost/shopping-manager';

const getConnection = (app) => {
  db.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('🎉 Successfully connected to the database!');
      app.emit('dbConnected');
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = {
  getConnection,
};
