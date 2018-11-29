const Configuration=require('../config')
const mongoose = require('mongoose')
const db = mongoose.connection;
const loggers = require('../core/prodloggers.js')

mongoose.Promise = require('bluebird')
const MongoConnect=mongoose.connect(Configuration.mongodb.DatabaseUrl,{ useNewUrlParser: true});
db.on('error', function(error){
	loggers.createLog({
	  level: 'error',
	  message: error
	});
	console.log(error)
});
db.on('disconnect',function(){
	mongoose.connect(Configuration.mongodb.DatabaseUrl,{ useNewUrlParser: true})
})

db.once('open', function() {
  if(process.env.NODE_ENV=='prod'){
	console.log('Connected To Production Database')
  }else{
	console.log('Connected To Local Database')
  }
});
module.exports = MongoConnect