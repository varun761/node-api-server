const mongoose = require('mongoose')

const connectToDB = async (url, mode) => {
	try {
		await mongoose.connect(url, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
			autoIndex: true
        })
		if (mode === 'development' || mode === 'production')
		  console.log(`connected to db ${url}`)
	} catch(e) {
		console.log(e)
		process.exit(1)
	}
}

module.exports = connectToDB