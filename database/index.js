const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URL = process.env.MONGODB_URL

const connectToDB = async () => {
	try {
		await mongoose.connect(MONGODB_URL, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
			autoIndex: true
        })
		console.log(`connected to db ${MONGODB_URL}`)
	} catch(e) {
		console.log(e)
		process.exit(1)
	}
}

module.exports = connectToDB