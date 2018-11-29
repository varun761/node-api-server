//require('module-alias/register')
require('dotenv').load();
const express = require ('express')
const app = express()
const http = require('http')
const cors = require('cors')

const bodyParser = require ('body-parser')
const routes = require('./routes')
const port = (process.env.NODE_ENV=='prod')? process.env.PROD_APP_PORT : process.env.DEV_APP_PORT
const hostname = (process.env.NODE_ENV=='prod')? process.env.PROD_APP_HOST : process.env.DEV_APP_HOST
const morgan=require('morgan')
const loggers =require('./core/prodloggers')
const hubspothandle = require('./core/hubspothandle')
const db=require('./db');
const RequestMiddleWare = function (req, res, next){
	//console.log(req);
	next()
}
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(RequestMiddleWare)
app.get('/',function(req,res){
	res.send('Api Services Are Running')
})
app.use('/api/v1/signup',routes.signup)


//console.log(nodecron.validate('00 16 * * * *'));
process.on('uncaughtException', err => {
  console.log(err);
  //process.stderr.write(`Caught Exception. Err: ${err}`, () => process.exit(1))
})

process.on('warning', (warning) => {
	let mes = warning.name +' '+warning.message+' '+warning.stack
	console.log(mes);
	//loggers.createLog({level:'warn',message:mes})
});
const server = http.createServer(app,(req,res)=>{
	res.writeHeader(200, {'Content-Type': 'text/html'})
	res.write('Ok')
	res.end()
})

server.listen(port,hostname,function() {
	console.log(`App running on ${hostname}:${port}`)
})