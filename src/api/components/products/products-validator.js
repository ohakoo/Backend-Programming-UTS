const joi = require('joi');

module.exports = {
  createPurchase: {
    body: {
        quantity: joi.number().integer().positive().min(1).max(99999).required().label("Quantity"),
    },
  },

  updateProduct: {
    body: {
      product_name: joi.string().min(1).max(100).required().label("Product's Name"),
      stock: joi.number().integer().positive().min(1).max(99999).required().label("Stock"),
      price: joi.number().integer().positive().min(1).max(99999).required().label("Price")
    }
  },

  createProduct: {
    body: {
      product_name: joi.string().min(1).max(100).required().label("Product's Name"),
      stock: joi.number().integer().positive().min(1).max(99999).required().label("Stock"),
      price: joi.number().integer().positive().min(1).max(99999).required().label("Price")
    }
  }
}

