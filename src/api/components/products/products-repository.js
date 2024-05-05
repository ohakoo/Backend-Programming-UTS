const { Purchase, Product} = require('../../../models');


/**
 * Get a list of products
 */
async function getProducts() {
  return Product.find({})
}

/**
 * Get a product's detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} product_name - Product's name
 * @param {integer} stock - Total product's quantity
 * @param {integer} price - Price's value
 * @returns {Promise}
 */
async function createProduct(product_name, stock, price){
  return Product.create({
    product_name,
    stock,
    price,
  });
}

/**
 * Create new purchase
 * @param {string} username 
 * @param {integer} product_name 
 * @param {integer} quantity 
 * @returns {Promise}
 */
async function createPurchase(username, product_name, quantity){
  return Purchase.create({
    username,
    product_name,
    quantity,
  });
}


/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {striung} product - Product' name
 * @param {integer} price - Price's value
 * @param {integer} quantity - Product's quantity
 * @returns {Promise}
 */
async function updateProduct(id, product_name, stock, price){
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product_name,
        stock,
        price
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id){
  return Product.deleteOne({ _id: id });
}


module.exports = {
  updateProduct,
  deleteProduct,
  createProduct,
  getProduct,
  getProducts,
  createPurchase
}


