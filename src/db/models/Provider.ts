const mongoose = require("mongoose");
const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  district: {
    type: String,
    required: [true, 'Please add a district']
  },
  province: {
    type: String,
    required: [true, 'Please add a province']
  },
  postalcode: {
    type: String,
    required: [true, 'Please add a postalcode'],
    maxlength: [5, 'Postal Code can not be more than 5 digits']
  },
  tel: {
    type: String,
    unique: true
  },
  region: {
    type: String,
    required: [true, 'Please add a region']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

ProviderSchema.virtual('booking', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'rentalCarProvider',
  justOne: false
}
);

const Provider = mongoose.model.rentalCarProvider || mongoose.model("Provider", ProviderSchema);
export default Provider
