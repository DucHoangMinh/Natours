const express = require('express')
const app = express()
const fs = require('fs')
const morgan = require('morgan')

// 1. Middleware
app.use(morgan('dev'))

app.use(express.json())

app.use((req, res, next) => {
  // console.log('Testing middleware...')
  next()
})

const port = 3000

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'))

// 2.ROUTE handle

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

const getTourById = (req, res) => {
  const id = req.params.id * 1
  if (id > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID.'
    })
  }
  const tour = tours.find(el => el.id === id)
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}

const postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({id: newId}, req.body)
  tours.push(newTour)
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
}

const editTour = (req, res) => {
  const id = req.params.id * 1
  if (id > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID.'
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: ''
    }
  })
}

const deleteTour = (req, res) => {
  const id = req.params.id * 1
  if (id > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID.'
    })
  }
  res.status(204).json({
    status: 'success',
    data: null
  })
}

// 3.Route

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(postTour)
app.route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(editTour)
  .delete(deleteTour)

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})