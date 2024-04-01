const Sequelize = require('sequelize');
const { guildId } = require('../config.json');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database/database.sqlite',
});

const Channels = require('./models/channels.js')(sequelize, Sequelize.DataTypes);
const Servers = require('./models/servers.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const channel = [
		Channels.upsert({ ChannelName: 'themagicdragin', DiscordServer: 'https://discord.gg/388R444EKw', guildId: guildId }),
		Channels.upsert({ ChannelName: 'chzplzz', DiscordServer: 'https://discord.gg/KtbsvvBWyd', guildId: guildId }),
		Channels.upsert({ ChannelName: 'pasbal', DiscordServer: 'https://discord.gg/mZP9x6CEVe', guildId: guildId }),
		Channels.upsert({ ChannelName: 'codemiko', DiscordServer: 'https://discord.gg/codemiko', guildId: guildId }),
	];
	const server = [
		Servers.upsert({ guildId: guildId, channelId: '872496220755591188', mainRoleId: '873383420573646939', otherRoleId: '873788813397360650' }),
	];

	await Promise.all(channel, server);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);