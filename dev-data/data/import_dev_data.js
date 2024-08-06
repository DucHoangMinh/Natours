const dotenv = require('dotenv')
const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require('./../../models/tourModels')

dotenv.config({ path: '../../config.env' })

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(conn => {
  console.log("DB connection successfully")
})

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully inserted')
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

// DELETE ALL DATA IN DB FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data successfully deleted')
    process.exit()
  } catch (error) {
    console.log(error)
  }
}
 if (process.argv[2] === '--import') {
   importData()
 } else if (process.argv[2] === '--delete') {
   deleteData()
 }