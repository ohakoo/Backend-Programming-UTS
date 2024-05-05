const productsRepository = require('./products-repository');
const { Product } = require('../../../models');

/**
 * Get total  that has been sold
 * 
 */

/**
 * Get list of products with pagination. sort, and search feature
 * @param {integer} page_number
 * @param {integer} page_size
 * @param {integer} sort
 * @param {integer} search
 * @returns {Array}
 */
async function getProducts(search, sort, page_number, page_size) {

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
   if (search[0] === "product_name"){
    searchInput = {product_name: {$regex: search[1], $options: "i"}}; 
  } else if (search[0] === "stock"){
    searchInput = {shipping_address: {$regex: search[1], $options: "i"}};
  } else if (search[0] === "price"){
    searchInput = {price: {$regex: search[1], $options: "i"}}
  };
 
  const products = await Product.find(searchInput)
  .limit(page_size*page_number)
  .skip(page_size*(page_number-1))
  .sort(sortBy)

  if (!page_size){
    page_size = products.length // (the default will proceed to show every users' data)
  }
  if (!page_number) {
    page_number = 1 // (default is set to 1)
  };

  // shows how many pages are there (Math.ceil() rounds decimals up)  
  total_pages = Math.ceil(products.length/page_size) 

  // shows everything between startPage and endPage

  has_previous_page = await hasPreviousPage(page_number)
  has_next_page = await hasNextPage(page_number, total_pages)
  count = products.length

  const data = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    data.push({
      id: product.id,
      product_name: product.product_name,
      stock: product.stock,
      price: product.price,
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
 * Get products detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getProduct(id) {
  const products = await productsRepository.getProducts(id);

  // products not found
  if (!products) {
    return null;
  }

  return {
    product: products.product,
    stock: products.stock,
    price: products.price,
  };
}

/**
 * Create new purchase request
 * @param {string} username
 * @param {string} product_name
 * @param {integer} quantity
 */

/**
 * Create new products
 * @param {string} product_name - Product's name
 * @param {integer} stock - Product's total quantity
 * @param {integer} price - Price's value
 * @returns {Promise}
 */
async function createProduct(product_name, stock, price) {

  try {
    await productsRepository.createProduct(product_name, stock, price);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing products
 * @param {string} id - products ID
 * @param {string} product - product's name
 * @param {string} price - product's price
 * @param {string} quantity - product's quantity
 * @returns {boolean}
 */
async function updateProduct(id, product_name, stock, price) {
  const products = await productsRepository.getProduct(id);

  // products not found
  if (!products) {
    return null;
  }

  try {
    await productsRepository.updateProduct(id, product_name, stock, price);
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
async function deleteProduct(id) {
  const products = await productsRepository.getProduct(id);

  // User not found
  if (!products) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(id);
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

async function updateProductPostPurchase(stock, id) {
  return Product.updateOne({id},
  { $set: {stock}})
}

module.exports = {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  hasPreviousPage,
  hasNextPage,
  updateProductPostPurchase,
}
