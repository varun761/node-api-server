require('dotenv').config()

const MONGODB_URL = process.env.MONGODB_URL || null

const express = require('express')

const { ValidationError } = require('express-validation')

const morgan = require('morgan')

const bodyParser = require('body-parser')

const connectToDB = require('./database')

const app = express()

const { userRouter , authRouter, postRouter, commentRouter } = require('./routes')

app.get('/', (req, res) => {
	res.send('API IS RUNNING')
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(bodyParser.json())

app.use('/user', userRouter)

app.use('/auth', authRouter)

app.use('/post', postRouter)

app.use('/comment', commentRouter)

const port = process.env.APPLICATION_PORT || 5001

app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
})

app.listen(port, async () => {
  if (MONGODB_URL) {
	  await connectToDB(MONGODB_URL);
  }
	console.log(`app is listening on port ${port}`)
})