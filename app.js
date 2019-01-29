const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./config");
const mail = require("./mail");
const model = require("./model");
const token = require("./token");

mongoose.connect(config.db);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => console.error("mongodb connection error"));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
	res.set({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
	});
	next();
})

app.route("/")
	.get((req, res, next) => {
		model.Vote.find({}, "-_id -__v", (error, votes) => {
			if (error) return next(error);
			res.send(votes);
		});
	})
	.post((req, res, next) => {
		model.User.find({ token: req.body.token }, (error, users) => {
			if (users.length == 0)
				return next();
		});

		model.Vote.deleteOne({ user: req.body.user }, (error) => {});

		let vote = new model.Vote({
			vote: req.body.vote,
			user: req.body.user
		});

		vote.save((error) => {
			if (error) return next(error);
			res.status(200).send();
		});
	});

app.route("/register").post((req, res, next) => {
	model.User.deleteOne({ email: req.body.email }, (error) => {});

	const t = token();
	let user = new model.User({
		email: req.body.email,
		token: t,
	});

	user.save((error) => {
		if (error) return next(error);
		mail.send(req.body.email, t);
		res.status(200).send();
	});	
});

const httpsServer = https.createServer(config.credentials, app);
httpsServer.listen(config.port, () => {
	console.log("server started on port " + config.port);
});