const { Purchase, User } = require('../../../models');
const purchasesValidator = require('./purchases-validator');

/**
 * Get a list of purchases
 */
async function getPurchases() {
  return Purchase.find({})
}

/**
 * Get a purchase's detail
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function getPurchase(id) {
  return Purchase.findById(id);
}

/**
 * Create new purchase
 * @param {string} product - Product's name
 * @param {integer} price - Price's value
 * @param {integer} quantity - Product's quantity
 * @param {string} shipping_address- Receiver's address
 * @param {date_purchased} date_purchased- Date when item was purchased
 * @returns {Promise}
 */
async function createPurchase(product, price, quantity, shipping_address, date_purchased){
  return Purchase.create({
    product,
    price,
    quantity,
    shipping_address,
    date_purchased,
  });
}


/**
 * Update an existing purchase
 * @param {string} id - Purchase ID
 * @param {striung} product - Product' name
 * @param {integer} price - Price's value
 * @param {integer} quantity - Product's quantity
 * @returns {Promise}
 */
async function updatePurchase(id, product, price, quantity){
  return Purchase.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product,
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a purchase
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function deletePurchase(id){
  return Purchase.deleteOne({ _id: id });
}


module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
}


