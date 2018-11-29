const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RolesSchema=new Schema({
	role_name: {type: String}
}) 
module.exports = mongoose.model('Role',RolesSchema)