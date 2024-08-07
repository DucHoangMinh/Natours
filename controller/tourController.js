const fs = require('fs')
const Tour = require('./../models/tourModels')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'))

exports.getAllTours = async (req, res) => {
  try {
    // 1.Filtering
    const queryObject = {...req.query}
    const excludedField = ['page', 'sort', 'limit', 'fields']
    excludedField.forEach(el => delete queryObject[el])

    // 2. Advanced filtering (<=, >=)
    let queryStr = JSON.stringify(queryObject)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    // 3. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // 4. Fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 5. Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1)*limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip >= numTours) {
        throw new Error('This page is not exist')
      }
    }

    const tours = await query
    // query.sort().select().skip().limit()
    // const tours = await Tour.find()
    //   .where('duration').equals(5)
    //   .where('difficulty').equals('easy')
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'There was a problem with this route'
    })
  }
}

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'There was a problem with this route'
    })
  }
}

exports.postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent'
    })
  }
}

exports.editTour = async (req, res) => {
  try {
    const tour = Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,// return new updated document to client,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Some thing wrong'
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      status: 'success',
      message: 'Xoa thanh cong'
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Some thing wrong'
    })
  }
}
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price'
  next()
}