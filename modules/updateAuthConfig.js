const fs = require('node:fs');
const Auth = require('./auth.js');
const config = require('../config.json');

// get a new authorization key and update the config
async function UpdateAuthConfig() {
	// get the auth key
	const authKey = await Auth.getKey(config.twitchClientId, config.twitchSecret);
	if (!authKey) return;

	// write the new auth key
	const tempConfig = JSON.parse(fs.readFileSync('./config.json'));
	tempConfig.authToken = authKey;
	fs.writeFileSync('./config.json', JSON.stringify(tempConfig, null, 2));
}
module.exports = { UpdateAuthConfig };