const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const e = require('express');

dotenv.config({ path: './config.env' })

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(conn => {
  console.log("DB connection successfully")
})

const port = 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})