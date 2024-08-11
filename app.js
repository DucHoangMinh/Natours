const express = require('express')
const app = express()
const dotenv = require('dotenv')
const fs = require('fs')
const morgan = require('morgan')

const tourRouter = require('./route/tourRoutes')
const userRouter = require('./route/userRoutes')
const e = require('express');

dotenv.config({ path: './config.env' })

// 1. Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  // console.log('Testing middleware...')
  next()
})


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `No endpoints found for ${req.originalUrl}`
  // })
  const err = new  Error('Not Found This Router Handler')
  err.status  = 'fail'
  err.statusCode = 404

  next(err)
})

app.use((err, req, res, next) => {
  // Check if err has statusCode or status or not
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

module.exports = app