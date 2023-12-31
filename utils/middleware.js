const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authToken = request.get('Authorization')
    if (authToken && authToken.startsWith('Bearer ')) {
        request.token =  authToken.replace('Bearer ', '')
    }

    next()
}

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = decodedToken.id

    next()
}

const unknownEndpoint = (request, response) => {
    return response.status(404).send({ error: 'unknown endpoint' })
  }
  

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({error: error.message})
    }

    next(error)
}

module.exports = {
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}