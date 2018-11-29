const mongoose = require('mongoose');
const Schema = mongoose.Schema

const CommentsSchema=new Schema({
	author_id  : {type: String},
	recipe_id : {type: String},
	comment_body : {type : String},
	created_on : {type : Date}
}) 
module.exports = mongoose.Model('Comment',CommentsSchema)