const config = require('../config')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.headers.authorization || request.query.token
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}

const checkLogin = (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, config.secret)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    return next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: error })
    }
  }
}

const checkAdmin = (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, config.secret)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    if (!decodedToken.admin) return res.status(401).json({ error: 'not admin' })
    return next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: error })
    }
  }
}

// checks that token's student number is the same as req.params.student_number
const checkValidStudentNumber = (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, config.secret)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    if (decodedToken.id !== req.params.student_number) return res.status(401).json({ error: 'student numbers not matching' })
    return next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: error })
    }
  }
}

module.exports = {
  checkLogin,
  checkAdmin,
  checkValidStudentNumber,
  getTokenFrom
}