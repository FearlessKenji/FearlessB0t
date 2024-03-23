const { writeLog } = require('../../../modules/writeLog.js');
const { SlashCommandBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot'),
	async execute(interaction) {
		if (interaction.user.id === config.botOwner) {
			await interaction.reply({ content: 'Restarting...', ephemeral: true });
			writeLog(`Restart command used by ${interaction.user.username}.`, 'Restarting...');
			process.exit();
		}
		else {
			await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		}
	},
};