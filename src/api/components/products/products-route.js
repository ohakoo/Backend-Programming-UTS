const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator')

const route = express.Router(); 


module.exports = (app) => {
  app.use('/products', route);

  // Get list of users
  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  // Takes item that wants to be purchased from stock
  route.put(
    '/purchase/:id',
    authenticationMiddleware,
    celebrate(productsValidator.createPurchase),
    productsControllers.addToPurchase
  );

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get product detail
  route.get('/:id', authenticationMiddleware, productsControllers.getProduct);

  // Update product
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
);

  // Delete product
  route.delete('/:id', authenticationMiddleware, productsControllers.deleteProduct);

};
