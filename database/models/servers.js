/*
 * equivalent to: CREATE TABLE channels(
 * guildId VARCHAR(255) PRIMARYKEY,
 * channelId VARCHAR(255) UNIQUE,
 * mainRoleId VARCHAR(255) UNIQUE,
 * otherRoleId VARCHAR(255) UNIQUE,
 * cron VARCHAR(255) NOT NULL
 * );
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('servers', {
		guildId: {
			type: DataTypes.STRING,
			primaryKey: true,
			get() {
				const rawValue = this.getDataValue('guildId');
				return rawValue ? rawValue : null;
			},
		},
		channelId: {
			type: DataTypes.STRING,
			unique: true,
			get() {
				const rawValue = this.getDataValue('channelId');
				return rawValue ? rawValue : null;
			},
		},
		mainRoleId: {
			type: DataTypes.STRING,
			unique: true,
			get() {
				const rawValue = this.getDataValue('mainRoleId');
				return rawValue ? rawValue : null;
			},
		},
		otherRoleId: {
			type: DataTypes.STRING,
			unique: true,
			get() {
				const rawValue = this.getDataValue('otherRoleId');
				return rawValue ? rawValue : null;
			},
		},
	},
	{
		timestamps: false,
	});
};