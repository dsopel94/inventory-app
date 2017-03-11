const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  product: String,
  form: String,
  hazardous: String,
  quantity: Number,
  location: String,
  url: String
});

inventorySchema.methods.apiRepr = function() {
  return {
    id: this._id,
    product: this.product,
    form: this.form,
    hazardous: this.hazardous,
    location: this.location,
    quantity: this.quantity,
    url: this.url
  };
}

const locationSchema = mongoose.Schema({
  name: String,
})

locationSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name
  }
}

const LocationList = mongoose.model('LocationList', locationSchema, 'locations');
const InventoryList = mongoose.model('InventoryList', inventorySchema, 'items');

module.exports = {InventoryList, LocationList};