const { SlashCommandBuilder } = require('discord.js');
const { Servers, Channels } = require('../../../database/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Edit channel list for affiliates.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a channel.')
				.addStringOption(option =>
					option.setName('name')
						.setDescription('Name of the channel to be added.')
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName('discord')
						.setDescription('Channel\'s Discord invite URL.'),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('delete')
				.setDescription('Delete a channel.')
				.addStringOption(option =>
					option.setName('name')
						.setDescription('Name of the channel to be deleted.')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'add') {
			const channelName = interaction.options.getString('name');
			const discordURL = interaction.options.getString('discord') || '\u200B';
			try {
				await Channels.upsert({ ChannelName: channelName, DiscordServer: discordURL, guildId: interaction.guild.id });
				await Servers.upsert({ guildId: interaction.guild.id });
				await interaction.reply({ content: 'Channel added successfully.', ephemeral: true });
			}
			catch (error) {
				console.error('Failed to add channel:', error);
				await interaction.reply({ content: 'Failed to add channel.', ephemeral: true });
			}
		}
		else if (subcommand === 'delete') {
			const channelName = interaction.options.getString('name');
			try {
				await Channels.destroy({ where: { ChannelName: channelName, guildId: interaction.guild.id } });
				await interaction.reply({ content: 'Channel deleted successfully.', ephemeral: true });
			}
			catch (error) {
				console.error('Failed to delete channel:', error);
				await interaction.reply({ content: 'Failed to delete channel.', ephemeral: true });
			}
		}
	},
};
