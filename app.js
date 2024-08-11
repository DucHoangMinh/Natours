const express = require('express')
const app = express()
const dotenv = require('dotenv')
const fs = require('fs')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')

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
  next(new AppError(`No endpoints found for ${req.originalUrl}`))
})

app.use(globalErrorHandler)

module.exports = app