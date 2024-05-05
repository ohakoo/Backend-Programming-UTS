const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');


// function in case time limit has reached or user has successfully logged in
async function resetLoginAttempt(attempts, lastAttempt){
    attempts = 0;
    lastAttempt = null;
}

async function loginTimeoutCheck(attempts, currentDate, lastAttempt){
  if (attempts >= 5 && attempts && (currentDate - lastAttempt) < 30*60*1000){
    return true
  }
  return false
}

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {

  const user = await authenticationRepository.getUserByEmail(email);
  let attempts = user.attempts 
  let lastAttempt = new Date(user.lastAttempt);

  const currentDateMessage = getDate()

  let currentDate = new Date();
  const timeoutCheck = await loginTimeoutCheck(attempts, currentDate, lastAttempt)

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {

    if (lastAttempt && (currentDate - lastAttempt) >= 30 * 60 * 1000) {
      // If user's last attempt is greater than 30 min, resets attempt 
      await resetLoginAttempt(attempts, lastAttempt)
      await authenticationRepository.updateLoginAttempt(attempts, currentDate, email)
      return `[${currentDateMessage}] User ${user.email} bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0`
    }  
    // message if user is still in timeout
    if (timeoutCheck) {
      return `[${currentDateMessage}] User ${user.email} mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.`
    } 

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    }
  } else {
    attempts += 1
    await authenticationRepository.updateLoginAttempt(attempts, currentDate, email)
    // message if user has exactly reached 5 attempts
    if (attempts == 5){
      return `[${currentDateMessage}] User ${user.email} gagal login. Attempt = ${attempts}. Limit reached`
    }

    if (timeoutCheck) {
      return `[${currentDateMessage}] User ${user.email} mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.`
    } 

    return `[${currentDateMessage}] User ${user.email} gagal login. Attempt = ${attempts}`
  }
}

// function returns 
function getDate(){
  const time = Date.now()
  const date = new Date(time);
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1) // january = 0, december = 11
  const day = String(date.getDay()) 
  const hour = String(date.getHours())
  const minutes = String(date.getMinutes())
  const seconds = String(date.getSeconds())

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

module.exports = {
  checkLoginCredentials,
  getDate,
};
