const express = require('express')
const fs = require('fs');
const tourController = require('./../controller/tourController')

const router = express.Router()

router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.postTour)
router.route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour)

module.exports = router