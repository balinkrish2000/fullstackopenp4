const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')

const mongoUrl = config.MONGODB_URI
logger.info('Connecting to', config.MONGODB_URI)
mongoose.connect(mongoUrl)
  .then(() => logger.info('Connected to', config.MONGODB_URI))
  .catch((error) => logger.error('Error connecting to MongoDB', error.message))

app.use(cors())
app.use(express.json())

app.use('/api/login', loginRouter)
app.use(middleware.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app