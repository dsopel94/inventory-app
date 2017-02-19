const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  product: String,
  form: String,
  hazardous: Boolean,
  location: String,
  quantity: Number
});

inventorySchema.methods.apiRepr = function() {
  return {
    id: this._id,
    product: this.product,
    form: this.form,
    hazardous: this.hazardous,
    location: this.location,
    quantity: this.quantity
  };
}

const InventoryList = mongoose.model('InventoryList', inventorySchema, 'items');

module.exports = {InventoryList};