const { SlashCommandBuilder } = require('discord.js');
const { Servers } = require('../../../database/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Configure server settings.')
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('Custom channel ID for notifications.')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('main-role')
				.setDescription('Custom main role ID for notifications.')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('other-role')
				.setDescription('Custom other role ID for notifications.'),
		),
	async execute(interaction) {
		const channelId = interaction.options.getString('channel');
		const mainRoleId = interaction.options.getString('main-role');
		const otherRoleId = interaction.options.getString('other-role');

		try {
			await Servers.upsert({ guildId: interaction.guild.id, channelId: channelId, mainRoleId: mainRoleId, otherRoleId: otherRoleId });
			await interaction.reply({ content: 'Server settings updated successfully.', ephemeral: true });
		}
		catch (error) {
			console.error('Failed to update server settings:', error);
			await interaction.reply({ content: 'Failed to update server settings.', ephemeral: true });
		}
	},
};
