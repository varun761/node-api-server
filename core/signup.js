const User = require('../db/models/users');
const bcrypt = require('bcryptjs')
const Joi= require('joi')


function SignupClass(){
}
//validate new user
SignupClass.prototype.validate = function(userobj){
	const schema={
		firstname:Joi.string().min(3).max(30).required(),
		lastname:Joi.string().min(3).max(30),
		email:Joi.string().email({ minDomainAtoms: 2 }).required(),
		username:Joi.string().alphanum().min(3).max(30).required(),
		pass:Joi.string().regex(/^[ A-Za-z0-9_@./#&+-]*$/).min(6).max(24).required(),
		dob:Joi.date().required(),
		gender:Joi.string().required()
	}
	return Joi.validate(userobj,schema)
}
//Check Username Exists
SignupClass.prototype.checkUsername=function(username){
	return new Promise((resolve,reject)=>{
		User.find({"username":username},function(err,user){
			if(err){
				reject(err)
			}
			if(user.length==0){
				resolve(false)
			}
			resolve(true)

		})
	})
	
}
//Check email exists
SignupClass.prototype.checkEmail=function(email){
	return new Promise((resolve,reject)=>{
		User.find({"email":email},function(err,user){
			if(err){
				reject(err)
			}
			if(user.length==0){
				resolve(false)
			}
			resolve(true)

		})
	})
	
}
//Create New User
SignupClass.prototype.createUser=function(userdata){
	return new Promise((resolve,reject)=>{
		let userData = {};
		userData.username = userdata.username.trim()
		userData.name = {
			first:userdata.firstname.trim(),
			last:(typeof(userdata.lastname)!=="undefined" && userdata.lastname!==null && userdata.lastname!=="")?userdata.lastname.trim():null
		}
		userData.email = userdata.email.trim()
		userData.gender = userdata.gender.trim()
		bcrypt.hash(userdata.pass.trim(),10).then(userPass=>{
			userData.pass=userPass
			let user = new User(userData);
			user.save(function(err,user){
				if(err){
					reject(err)
				}
				resolve(user)
			})
		})
	})
	
}
module.exports= SignupClass