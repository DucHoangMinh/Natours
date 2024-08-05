const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(conn => {
  console.log("DB connection successfully")
})

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: Number
})

const Tour = mongoose.model('Tour', tourSchema)

const port = 3000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})