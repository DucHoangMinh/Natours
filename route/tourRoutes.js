const express = require('express')
const fs = require('fs');
const tourController = require('./../controller/tourController')

const router = express.Router()

router.param('id', tourController.checkID)

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handleware stack

router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.postTour)
router.route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.editTour)
  .delete(tourController.deleteTour)

module.exports = router