const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const clientId = process.env.CLIENT_ID || '';
const guildId = process.env.GUILD_ID || '';
const token = process.env.BOT_TOKEN || '';

const commands = [
	new SlashCommandBuilder().setName('hello').setDescription('Responde com Hello World!'),
	new SlashCommandBuilder().setName('help').setDescription('Dar Help'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);