const { SlashCommandBuilder } = require('@discordjs/builders');
const { wait } = require('../helpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Responde com um hello world!'),
	async execute(interaction) {
		await interaction.reply('Hello!');
		await wait(2000);
		return interaction.editReply('Hello World!');
	},
};
