const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Name is unique'],
    maxlength: [40, 'Name is too long (<40 charaters)'],
    minlength: [10, 'Name is too short (>10 charaters)']
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
    enum: {
      values:['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Ratings must be above 1.0'],
    max: [5, 'Ratings must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(value){
        // this only points to current document on NEW document creation
        return value < this.price
      },
      message: 'Price need to bigger than price discount'
    }
  },
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

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift( { $match: {secretTour: { $ne: true } } } )
  next()
})


const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour
