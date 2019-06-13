/**
 * The connection to MongoDB via Mongoose
 */
const mongoose = require('mongoose');

// TODO: change to real mongo server when ready
const connectDb = () => {
  return mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
  });
};

module.exports = { connectDb };
