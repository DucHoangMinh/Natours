const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Name is unique']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: Number
})

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour
