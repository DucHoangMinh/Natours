const fs = require('fs')
const Tour = require('./../models/tourModels')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'))

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()
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