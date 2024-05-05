const productsService = require('./products-service')
const { errorResponder, errorTypes } = require('../../../core/errors');


/**
 * Handle get list of product request 
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {

    const page_number = parseInt(request.query.page_number)
    const page_size = parseInt(request.query.page_size)
    const search = request.query.search || "";
    const sort = request.query.sort || "product_name";

    const products = await productsService.getProducts(
      search,
      sort,
      page_number,
      page_size
    )

    return response.status(200).json(products);
  } catch (error) { 
    return next(error);
  } 
}

/**
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}


/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
      const product_name = request.body.product_name;
      const stock = request.body.stock;
      const price = request.body.price;

    const success = await productsService.createProduct(product_name, stock, price);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ product_name, stock, price });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const product_name = request.body.product_name;
    const stock = request.body.stock;
    const price = request.body.price;

    const success = await productsService.updateProduct(id, product_name, stock, price);
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
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
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

/**
 * Handle purchase of an item request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function addToPurchase(request, response, next){
try{
  const product_id = request.params.id;


  const product = await productsService.getProduct(product_id)
  const quantity = request.body.quantity;

  if (!product) {
      return { success: false, message: "Product can't be found!"};
  }

  if (product.stock < quantity) {
    return { success: false, message: "Product's stock isn't enough!"}
  }
  
  const productname = product.product_name
  const totalPrice = product.price * quantity
  const stockLeft = product.stock - quantity
  updateProductPostPurchase(stockLeft, product_id) // updates current product's stock in database
  return response.status(200).json({ productname, totalPrice, stockLeft })
  } catch (error) {
    return next(error)
  }

}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addToPurchase
};
