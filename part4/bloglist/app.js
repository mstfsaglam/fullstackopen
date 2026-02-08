const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

logger.info('connection to ', MONGODB_URI)

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Connected to database')
  })
  .catch(error => {
    logger.info('Error connection to database', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app