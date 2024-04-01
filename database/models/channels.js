/*
 * equivalent to: CREATE TABLE channels(
 * id INTEGER PRIMARYKEY AUTOINCREMENT,
 * name VARCHAR(255),
 * discordUrl VARCHAR(255),
 * streamId VARCHAR(255),
 * messageId VARCHAR(255) UNIQUE,
 * serverId VARCHAR(255) NOT NULL
 * );
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('channels', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ChannelName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'compositeIndex', // Ensure unique within the same guildId
		},
		DiscordServer: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		twitch_stream_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		discord_message_id: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true, // Ensure globally unique
		},
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'compositeIndex', // Ensure unique within the same guildId
		},
	}, {
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['ChannelName', 'guildId'], // Composite unique index
				name: 'compositeIndex',
			},
		],
	});
};
