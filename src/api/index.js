const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const purchases = require('./components/purchases/purchases-route')

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  purchases(app);

  return app;
};
