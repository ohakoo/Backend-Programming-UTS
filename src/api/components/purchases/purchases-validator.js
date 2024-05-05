const joi = require('joi');

module.exports = {
  createPurchase: {
    body: {
        product: joi.string().min(1).max(100).required().label("Product"),
        price: joi.number().integer().positive().min(1).max(99999).required().label("Price"),
        quantity: joi.number().integer().positive().min(1).max(99999).required().label("Quantity"),
        shipping_address: joi.string().min(1).max(100).required().label("Shipping Address"),
        date_purchased: joi.date().label('Date Purchased')
    },
  },

  updatePurchase: {
    body: {
      customer_name: joi.string().min(1).max(20).required().label("Customer's Name"),
      product: joi.string().min(1).max(100).required().label("Product"),
      price: joi.number().integer().positive().min(1).max(20).required().label("Price"),
      quantity: joi.number().integer().positive().min(1).max(20).required().label("Quantity")
    },
  },
}

