require('dotenv').config()

const express = require('express')

const { ValidationError } = require('express-validation')

const morgan = require('morgan')

const bodyParser = require('body-parser')

const connectToDB = require('./database')

const { userRouter , authRouter, postRouter, commentRouter, categoryRouter } = require('./routes/v1/')

const app = express()

const MONGODB_URL = process.env.MONGODB_URL || null

const port = process.env.APPLICATION_PORT || 5001

app.get('/', (req, res) => {
	res.send('API IS RUNNING')
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(bodyParser.json())

app.use('/v1/user', userRouter)

app.use('/v1/auth', authRouter)

app.use('/v1/post', postRouter)

app.use('/v1/comment', commentRouter)

app.use('/v1/category', categoryRouter)

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