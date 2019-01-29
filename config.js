const fs = require("fs");

module.exports = {
	domain: "wasstahtufemplan.ga",
	port: 3000,
	db: "mongodb://localhost/plantage",
	credentials: {
		key: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/privkey.pem", "utf8"),
		cert: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/fullchain.pem", "utf8")
	},
	mail: {
		from: "'Plantage' <noreply@wasstahtufemplan.ga>",
		host: "smtp.localhost",
		port: 25,
		secure: "false",
	},
};