const mongoose = require('mongoose')

const connectToDB = async (url) => {
	try {
		await mongoose.connect(url, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
			autoIndex: true
        })
		console.log(`connected to db ${url}`)
	} catch(e) {
		console.log(e)
		process.exit(1)
	}
}

module.exports = connectToDB