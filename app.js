const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const { info, error } = require('./utils/logger')

const mongoUrl = config.MONGODB_URI
info('Connecting to', config.MONGODB_URI)
mongoose.connect(mongoUrl)
  .then(() => info('Connected to', config.MONGODB_URI))
  .catch((error) => error('Error connecting to MongoDB', error.message))

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app