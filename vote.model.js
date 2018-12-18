const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VoteSchema = new Schema({
	timestamp: {type: Date, expires: "1d", default: Date.now},
	user: {type: String},
	vote: {type: String, required: true}
});

module.exports = mongoose.model("Vote", VoteSchema);