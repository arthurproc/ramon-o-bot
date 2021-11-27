const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { registerCommands } = require('./config');
require('dotenv').config();
const token = process.env.BOT_TOKEN || '';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandList = [];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	commandList.push(command.data);
}

client.on('ready', () => {
	console.log('Ramon ta on!!!');
	// const guildIds = client.guilds.cache.map(guild => guild.id);
	// const commands = commandList.map(command => command.toJSON());

	// for (const guildId of guildIds) {
	// 	registerCommands(guildId, commands);
	// }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
