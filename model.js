const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Vote = new Schema({
	timestamp: { type: Date, expires: "12h", default: Date.now },
	vote: { type: String, required: true },
	name: { type: String, required: true },
});

let User = new Schema({
	email: { type: String, required: true },
	name: { type: String, required: true },
	token: { type: String, required: true },
});

module.exports = {
	Vote: mongoose.model("Vote", Vote),
	User: mongoose.model("User", User),
};
