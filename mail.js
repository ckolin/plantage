const nodemailer = require("nodemailer");

const config = require("./config");

const transporter = nodemailer.createTransport({
	host: config.mail.host,
	port: config.mail.port,
	secure: config.mail.secure,
});

function send(to, token) {
	const options = {
		from: config.mail.from,
		to: to,
		subject: "[Plantage] Your Account",
		html: `<h2>Plantage</h2><h1>Your Account</h1><p>Click <a href=https://${config.domain}#${token}>here</a> to activate your account.</p>`,
	};
	
	transporter.sendMail(options);
}

module.exports = {
	send: send,
};