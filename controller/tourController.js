const fs = require('fs')
const Tour = require('./../models/tourModels')
const APIFeatures = require('../utils/apiFeatures')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'))



exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query

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
      message: error.message
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
      message: error.message
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

exports.getTourStats = async (req, res) => {
  try {
    // Pass an array to define stages that data go through
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } } // Match nhu kieu filter, lay nhung cai nao co rating lon hon 4.5
      },
      {
        $group: { // Group document together by accumulator
          _id: '$difficulty', // Everything in one group
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          numRating: { $sum: '$ratingsQuantity' },
          numTours: { $sum: 1 },
        }
      },
      {
        $sort: { avgPrice: 1 } // Su dung ten truong dinh nghia o tren, 1 for asc
      },
      {
        $match: { _id: { $ne: 'easy' } }
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Some thing wrong'
    })
  }
}

exports.getMonthlyPlans = async (req, res) => {
  try{
    const year = req.params.year * 1 //2021
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year}-12-31`)
          }
        }
      },{
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: {$sum: 1},
          tours: { $push: '$name' }
        }
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    })
  }
}