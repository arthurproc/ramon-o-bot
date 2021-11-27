const { SlashCommandBuilder } = require('@discordjs/builders');
// const { wait } = require('../helpers');
const { join } = require('path');
const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eimane')
		.setDescription('Você acha que seu som é bom?!'),
	async execute(interaction) {

		const channel = interaction.member.voice;
		const connection = joinVoiceChannel({
			channelId: channel.channelId,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		try {
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});
			// Will use FFmpeg with volume control enabled
			const resource = createAudioResource(join(__dirname, '../audio_files/eimane.mp3'), { inlineVolume: true });
			resource.volume.setVolume(1);
			// Subscribe the connection to the audio player (will play audio on the voice connection)
			player.play(resource);

			connection.subscribe(player);

			player.on(AudioPlayerStatus.Paused, () => {
				console.log('Ta pausado!');
			});

			player.on(AudioPlayerStatus.Playing, () => {
				console.log('Ta tocando!');
			});

			player.on(AudioPlayerStatus.Idle, () => {
				connection.destroy();
			});

		}
		catch (error) {
			console.log(error);
		}
		// finally {
		// 	player.stop();
		// 	connection.destroy();
		// }
		return interaction.reply('Ei, pish. Ei mané!! Você acha que o seu som é bom??!!');
	},
};