const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UsersSchema=new Schema({
	username : { type: String , unique: true},
	pass : {type : String},
	email: {type: String},
	name : {
		first : {type: String},
		last  : {type: String},
	},
	gender: {type: String},
	address : {
		address_line : {type : String , default:''},
		city : {type : String , default:''},
		state: {type : String , default:''},
		postal_code: {type: Number,default:0}
	},
	isVerified:{type:Boolean, default:false}
},{timestamps: { createdAt: 'created_at' }})
UsersSchema.index({ username: 1 })
UsersSchema.index({ email: 1 })
UsersSchema.index({ pass: 1 }) 

module.exports = mongoose.model('User',UsersSchema)
