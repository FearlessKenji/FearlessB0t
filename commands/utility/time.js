const { SlashCommandBuilder } = require('discord.js');

function epochTime() {
	const epoch = Math.floor(Date.now() / 1000);
	return epoch;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with the current time and date.'),
	async execute(interaction) {
		const discordTime = `<t:${epochTime()}:t>`;
		const discordDate = `<t:${epochTime()}:d>`;
		await interaction.reply({ content: `It is currently ${discordTime}, ${discordDate}.`, fetchReply: true });
	},
};