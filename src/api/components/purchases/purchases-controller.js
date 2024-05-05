const purchasesService = require('./purchases-service')
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of purchase request 
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getPurchases(request, response, next) {
  try {

    const page_number = parseInt(request.query.page_number)
    const page_size = parseInt(request.query.page_size)
    const search = request.query.search || "";
    const sort = request.query.sort || "product";

    const purchases = await purchasesService.getPurchases(
      search,
      sort,
      page_number,
      page_size
    )

    return response.status(200).json(purchases);
  } catch (error) { 
    return next(error);
  } 
}

/**
 * Handle get purchase detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getPurchase(request, response, next) {
  try {
    const purchase = await purchasesService.getPurchase(request.params.id);

    if (!purchase) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(purchase);
  } catch (error) {
    return next(error);
  }
}


/**
 * Handle create purchase request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createPurchase(request, response, next) {
  try {
      const product = request.body.product;
      const price = request.body.price;
      const quantity = request.body.quantity;
      const shipping_address = request.body.shipping_address;
      const date_purchased = request.body.date_purchased;

    const success = await purchasesService.createPurchase(product, price, quantity, shipping_address, date_purchased);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create purchase'
      );
    }

    return response.status(200).json({ product, price, quantity, shipping_address, date_purchased });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update purchase request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updatePurchase(request, response, next) {
  try {
    const product = request.body.price;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await purchasesService.updatePurchase(id, product, price, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete purchase request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deletePurchase(request, response, next) {
  try {
    const id = request.params.id;

    const success = await purchasesService.deletePurchase(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
