const fs = require("fs");

module.exports = {
	port: 3000,
	mongodb: "mongodb://localhost/plantage",
	credentials: {
		privateKey: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/privkey.pem", "utf8"),
		certificate: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/cert.pem", "utf8"),
		ca: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/chain.pem", "utf8")
	}
};