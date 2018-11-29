const winston = require('winston')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error_logs.log', level: 'error'}),
	new winston.transports.File({ filename: 'logs/warnings_logs.log', level: 'warn'}),
    //new winston.transports.File({ filename: 'logs/combined_logs.log',timestamp: true })
  ],
  exitOnError: false
});
module.exports={
	createLog (options){
		let logs_date = new Date().toLocaleString();
		if(options.message instanceof Error){
			let logs_message = 'Created At: '+logs_date +' - '+ options.message.stack;
			logger.log({
				level: options.level,
				message: logs_message
			});
		}else{
			let logs_message ='Created At: '+logs_date +' - '+options.message;
			logger.log({
				level: options.level,
				message: logs_message
			});
		}	
	}
}