const fs = require("fs");

module.exports = {
	port: 3000,
	mongodb: "mongodb://localhost/plantage",
	credentials: {
		key: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/privkey.pem", "utf8"),
		cert: fs.readFileSync("/etc/letsencrypt/live/wasstahtufemplan.ga/fullchain.pem", "utf8")
	}
};