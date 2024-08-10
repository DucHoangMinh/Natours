const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Name is unique']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Max Group Size is required'],
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, // Remove white space
    required: [true, 'Summary is required'],
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Image cover is required'],
  },
  images: [String], // Array of String
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  slug: {
    type: String
  },
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtuals: true,
  }, toObject: {
    virtuals: true
  }
})

tourSchema.virtual('durationWeek').get(function(){
  return this.duration / 7
})

// DOCUMENT MIDDLEWARE: run before .save() and .create(), not .insertMany()
// tourSchema.pre('save', function(next){
//   // This point to currently processed document
//   this.slug = slugify(this.name, {
//     lower: true
//   })
//   next()
// })
// tourSchema.post('save', function(doc,next) {
//   console.log(doc)
//   next()
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`)
  next()
})



const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour
