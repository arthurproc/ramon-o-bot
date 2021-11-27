const { SlashCommandBuilder } = require('@discordjs/builders');
const { wait } = require('../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Hello!');
		await wait(2000);
		return interaction.editReply('Hello Wordl!');
	},
};