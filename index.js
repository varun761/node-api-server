require('dotenv').config()

const express = require('express')

const { ValidationError } = require('express-validation')

const bodyParser = require('body-parser')

const connectToDB = require('./database')

const app = express()

const { userRouter , authRouter } = require('./routes')

app.get('/', (req, res) => {
	res.send('API IS RUNNING')
})

app.use(bodyParser.json())

app.use('/user', userRouter)

app.use('/auth', authRouter)

const port = process.env.APPLICATION_PORT || 5001

app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
})

app.listen(port, async () => {
	await connectToDB();
	console.log(`app is listening on port ${port}`)
})