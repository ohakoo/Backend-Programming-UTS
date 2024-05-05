const usersSchema = {
  name: String,
  email: String,
  password: String,
  attempts: {type: Number, default: 0},// amount of attempts done by user
  lastAttempt: {type: Date, default: 0} // last time attempted 
};

module.exports = usersSchema;
