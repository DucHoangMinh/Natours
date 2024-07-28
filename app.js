const express = require('express')
const app = express()
const fs = require('fs')
const morgan = require('morgan')

const tourRouter = require('./route/tourRoutes')
const userRouter = require('./route/userRoutes')

// 1. Middleware
app.use(morgan('dev'))

app.use(express.json())

app.use((req, res, next) => {
  // console.log('Testing middleware...')
  next()
})


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app