const nodemailer = require("nodemailer");

const config = require("./config");

const transporter = nodemailer.createTransport({
	host: config.mail.host,
	port: config.mail.port,
	secure: config.mail.secure,
	tls: config.mail.tls,
});

async function send(to, token) {
	const options = {
		from: config.mail.from,
		to: to,
		subject: "Plantage | Your Account",
		html: `<h3>Click <a href=https://${config.domain}#${token}>here</a> to activate your account.</h3>`,
	};
	
	await transporter.sendMail(options);
}

module.exports = {
	send: send,
};