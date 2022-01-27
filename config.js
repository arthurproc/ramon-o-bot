const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const registerCommands = async (guildId, commands) => {
	const clientId = process.env.CLIENT_ID || '';
	const token = process.env.BOT_TOKEN || '';
	const rest = new REST({ version: '9' }).setToken(token);
	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		console.log('Successfully registered application commands.');
	}
	catch (error) {
		console.log(error);
	}
};

module.exports = {
	registerCommands,
};
