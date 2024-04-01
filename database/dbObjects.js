const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database/database.sqlite',
});

const Servers = require('./models/servers.js')(sequelize, Sequelize.DataTypes);
const Channels = require('./models/channels.js')(sequelize, Sequelize.DataTypes);

Channels.belongsTo(Servers, { foreignKey: 'guildId', targetKey: 'guildId' });

module.exports = { Servers, Channels };
