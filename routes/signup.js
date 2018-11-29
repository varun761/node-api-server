const express = require('express')
const signup = express.Router()
const SignupClass =require('../core/signup')
const SignupObj = new SignupClass();
//signup.use(csrf({ cookie: true }));
signup.post('/create',( req,res ) => {
	
	const {error} = SignupObj.validate(req.body)
	if(error && error.details){
		//IF ERROR SEND ERROR MESSAGE WITH CODE
		console.log(error.details);
		return res.status(200).json(error.details);
	}
	//PROCEED WITH SAVING DATA
	SignupObj.checkUsername(req.body.username).then(existsuser=>{
		if(existsuser){
			return res.status(200).json({error:"Username Exists"})
		}else{
			SignupObj.checkEmail(req.body.email).then(existsemail=>{
				if(existsemail){
					return res.status(200).json({error:"Email Exists"})
				}else{
					SignupObj.createUser(req.body).then(users=>{
						res.status(200).json(users)
					}).catch(function(err){
						console.log(err)
					})
				}
			}).catch(function(err){
				console.log(err)
			})
		}
	}).catch(function(err){
		console.log(err)
	})
})
signup.post('/checkuser',( req,res ) => {
	SignupObj.checkUsername(req.body.username).then(existsuser=>{
		if(existsuser){
			return res.status(400).json({error:"Username Exists"})
		}else{
			return res.status(200)
		}
	})
})
module.exports = signup