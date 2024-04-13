const { Events, ActivityType } = require('discord.js');
const { writeLog } = require('../modules/writeLog.js');
const { Servers, Channels } = require('../database/dbObjects.js');
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		// Ready
		Channels.sync();
		Servers.sync();
		console.log(writeLog(`Ready! Logged in as ${client.user.tag}`));
		client.user.setActivity({
			type: ActivityType.Custom,
			name: 'CustomStatus',
			state: 'Rebooting...',
		});
	},
};