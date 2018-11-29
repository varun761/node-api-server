const mongoose = require('mongoose');
const Schema = mongoose.Schema

const SuggestSchema=new Schema({
	username : { type: String , unique: true},
	taken: {type: Boolean},
	created_at: { type: Date, default: Date.now }
}) 
module.exports = mongoose.model('suggestname',SuggestSchema)