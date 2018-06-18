var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AddressSchema = new Schema(
  {
      first_name: {type: String, required: true, max: 100},
      last_name: {type: String, required: true, max: 100},
      address: {type: String, required: true, max: 100}
  }
);

// Virtual for address URL
AddressSchema
.virtual('url')
.get(function () {
  return '/catalog/address/' + this.id;
});

//Export model
module.exports = mongoose.model('Address', AddressSchema);