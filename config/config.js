const Configuration = {
	mongodb:{
		username: (process.env.NODE_ENV == 'prod') ? process.env.PROD_MONGODB_USERNAME : process.env.DEV_MONGODB_USERNAME,
		password: (process.env.NODE_ENV == 'prod') ? process.env.PROD_MONGODB_PASSWORD : process.env.DEV_MONGODB_PASSWORD,
		DatabaseUrl:(process.env.NODE_ENV == 'prod') ? process.env.PROD_MONGODB_URL : process.env.DEV_MONGODB_URL
	}
}

module.exports = Configuration