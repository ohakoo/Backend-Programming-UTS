const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const purchasesControllers = require('./purchases-controller');
const purchasesValidator = require('./purchases-validator')

const route = express.Router(); 


module.exports = (app) => {
  app.use('/purchases', route);

  // Get list of users
  route.get('/', authenticationMiddleware, purchasesControllers.getPurchases);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(purchasesValidator.createPurchase),
    purchasesControllers.createPurchase
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, purchasesControllers.getPurchase);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(purchasesValidator.updatePurchase),
    purchasesControllers.updatePurchase
);

  // Delete user
  route.delete('/:id', authenticationMiddleware, purchasesControllers.deletePurchase);

};
