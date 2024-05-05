const purchasesRepository = require('./purchases-repository');
const { Purchase } = require('../../../models');

/**
 * Get list of purchases with pagination. sort, and search feature
 * @param {integer} page_number
 * @param {integer} page_size
 * @param {integer} sort
 * @param {integer} search
 * @returns {Array}
 */
async function getPurchases(search, sort, page_number, page_size) {

  // If sort received, then split sorts, else assign sorts in an array
  if (sort) {
    var sorts = sort.split(":")
   } else {
     sorts = [sort]
   }
   
   // If sorts is greater than 1 then user specified order, otherwise the default is ascending
   let sortBy = {};
   if (sorts[1]) {
     sortBy[sorts[0]] = sorts[1]
   } else {
     sortBy[sorts[0]] = 'asc';
   }

  // search[0] lets user decide which data to search and searchInput will 
  // input what search[1] has received
  let searchInput = {};
  var search = search.split(":")
   if (search[0] === "product"){
    searchInput = {product: {$regex: search[1], $options: "i"}}; 
  } else if (search[0] === "shipping_address"){
    searchInput = {shipping_address: {$regex: search[1], $options: "i"}};
  } else if (search[0] === "date_purchased"){
    searchInput = {date_purchased: {$regex: search[1], $options: "i"}};
  } else if (search[0] === "price"){
    searchInput = {price: {$regex: search[1], $options: "i"}};
  } else if (search[0] === "quantity"){
    searchInput = {quantity: {$regex: search[1], $options: "i"}}
  }

  const purchases = await Purchase.find(searchInput)
  .limit(page_size*page_number)
  .skip(page_size*(page_number-1))
  .sort(sortBy)

  if (!page_size){
    page_size = purchases.length // (the default will proceed to show every users' data)
  }
  if (!page_number) {
    page_number = 1 // (default is set to 1)
  };

  // shows how many pages are there (Math.ceil() rounds decimals up)  
  total_pages = Math.ceil(purchases.length/page_size) 

  // shows everything between startPage and endPage

  has_previous_page = await hasPreviousPage(page_number)
  has_next_page = await hasNextPage(page_number, total_pages)
  count = purchases.length

  const data = [];
  for (let i = 0; i < purchases.length; i += 1) {
    const purchase = purchases[i];
    data.push({
      product: purchase.product,
      price: purchase.price,
      quantity: purchase.quantity,
      shipping_address: purchase.shipping_address,
      date_purchased: purchase.date_purchased,
    });
  }

  let results = {
    page_number,
    page_size,
    count,
    total_pages,
    has_previous_page,
    has_next_page,
    data,
  }
  
  return results;
} 

/**
 * Get purchase detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getPurchase(id) {
  const purchase = await purchasesRepository.getPurchase(id);

  // Purchase not found
  if (!purchase) {
    return null;
  }

  return {
    product: purchase.product,
    price: purchase.price,
    quantity: purchase.quantity,
    shipping_address: purchase.shipping_address,
    date_purchased: purchase.date_purchased,
  };
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
async function createPurchase(product, price, quantity, shipping_address, date_purchased) {

  try {
    await purchasesRepository.createPurchase(product, price, quantity, shipping_address, date_purchased);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing purchase
 * @param {string} id - Purchase ID
 * @param {string} product - product's name
 * @param {string} price - product's price
 * @param {string} quantity - product's quantity
 * @returns {boolean}
 */
async function updatePurchase(id, product, price, quantity) {
  const purchase = await purchasesRepository.getPurchase(id);

  // Purchase not found
  if (!purchase) {
    return null;
  }

  try {
    await purchasesRepository.updatePurchase(id, product, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deletePurchase(id) {
  const purchase = await purchasesRepository.getPurchase(id);

  // User not found
  if (!purchase) {
    return null;
  }

  try {
    await purchasesRepository.deletePurchase(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Checks if there's a page at the previous page 
 * @param {integer} page_number
 * @returns {string}
 */
async function hasPreviousPage(page_number) {
  if (page_number > 1) {
    return true;
  } else if (page_number == 1){
    return false;
  } else {
    return false;
  }
}

/**
 * Checks if there's a page at the next page 
 * @param {integer} page_number
 * @param {integer} total_pages
 * @returns {string}
 */
async function hasNextPage(page_number, total_pages) {
  if (page_number == total_pages){
    return false;
  }
    return true;
}

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  hasPreviousPage,
  hasNextPage
}
