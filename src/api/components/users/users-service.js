const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { User } = require('../../../models');

/**
 * Get list of users with pagination, sort, and search feature
 * @param {integer} page_number
 * @param {integer} page_size
 * @param {integer} sort
 * @param {integer} search
 * @returns {Array}
 */
async function getUsers(search, sort, page_number, page_size) {
  

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
  if (search[0] === "name") {
    searchInput = {name: {$regex: search[1], $options: "i"}}; // "i" means that character will be matched regardless if they are in lowercase or uppercase
  } else if (search[0] === "email"){
    searchInput = {email: {$regex: search[1], $options: "i"}}; 
  }

  const users = await User.find(searchInput)
  .limit(page_size*page_number)
  .skip(page_size*(page_number-1))
  .sort(sortBy)

  if (!page_size){
    page_size = users.length // (the default will proceed to show every users' data)
  }
  if (!page_number) {
    page_number = 1 // (default is set to 1)
  };

  // shows how many pages are there (Math.ceil() rounds decimals up)  
  total_pages = Math.ceil(users.length/page_size) 

  // shows everything between startPage and endPage

  has_previous_page = await hasPreviousPage(page_number)
  has_next_page = await hasNextPage(page_number, total_pages)
  count = users.length

  const data = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    data.push({
      id: user.id,
      name: user.name,
      email: user.email,
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
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
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
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
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
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  hasPreviousPage,
  hasNextPage
}
