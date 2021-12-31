const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, demuxProbe, createAudioResource } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { getVideos, getVideoStream } = require('../helpers/youtube');

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Baixa um video do youtube')
		.addStringOption(option => option.setName('search').setDescription('String para pesquisar').setRequired(true)),
	async execute(interaction) {
		const channel = interaction.member.voice;

		const connection = joinVoiceChannel({
			channelId: channel.channelId,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		
		try {
			const searchString = interaction.options.getString('search');

			let videoLink = '';

			if (!ytdl.validateID(searchString) && !ytdl.validateURL(searchString)) {
				const videos = await getVideos(searchString);
				videoLink = videos[0].link;
			}
			else {
				videoLink = searchString;
			}

			let info = await ytdl.getInfo(videoLink);
			const ytStream = getVideoStream(videoLink);

			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});

			const resource = await probeAndCreateResource(ytStream);
			player.play(resource);
			
			connection.subscribe(player);

			player.on(AudioPlayerStatus.Paused, () => {
				console.log('Ta pausado!');
			});

			player.on(AudioPlayerStatus.Playing, () => {
				console.log('Ta tocando!');
				interaction.reply(`Tocando: ${info.videoDetails.title} no youtube`);
			});

			player.on(AudioPlayerStatus.Idle, () => {
				player.stop();
				connection.destroy();
			});

			player.on('error', error => {
				console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
				player.play(getNextResource());
			});
		}
		catch (error) {
			return interaction.reply('Não encontrei o video ou link');
		}
	},
};
