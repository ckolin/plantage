const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config");

const app = express();

mongoose.connect(config.mongodb);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => console.error("mongodb connection error"));

const Vote = require("./vote.model");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
	res.set({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
	});
	next();
})

app.route("/")
	.get((req, res, next) => {
		Vote.find({}, "-_id -__v", (error, votes) => {
			if (error) return next(error);
			res.send(votes);
		});
	})
	.post((req, res, next) => {
		Vote.remove({user: req.body.user}, (error) => {});

		let vote = new Vote({
			vote: req.body.vote,
			user: req.body.user
		});

		vote.save((error) => {
			if (error) return next(error);
			res.status(200).send();
		});
	});

app.listen(config.port, () => {
	console.log("started server on port " + config.port);
})