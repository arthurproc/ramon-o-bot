const { SlashCommandBuilder } = require('@discordjs/builders');
const { join } = require('path');
const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
var Downloader = require("../helpers/downloader");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Baixa um video do youtube'),
	async execute(interaction) {

		// const channel = interaction.member.voice;
		// const connection = joinVoiceChannel({
		// 	channelId: channel.channelId,
		// 	guildId: channel.guild.id,
		// 	adapterCreator: channel.guild.voiceAdapterCreator,
		// });
		try {
      var dl = new Downloader();
      var i = 0;

      dl.downloadMp3({videoId: "dQw4w9WgXcQ"}, function(err,res){
			    console.log("baixando");
          i++;
          if(err)
              throw err;
          else{
              console.log("Song "+ i + " was downloaded: " + res.file);
          }
      });
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});
			// Will use FFmpeg with volume control enabled
			// const resource = createAudioResource(join(__dirname, '../audio_files/eimane.mp3'), { inlineVolume: true });
			// resource.volume.setVolume(1);
			// Subscribe the connection to the audio player (will play audio on the voice connection)
			// player.play(resource);

			// connection.subscribe(player);

			// player.on(AudioPlayerStatus.Paused, () => {
			// 	console.log('Ta pausado!');
			// });

			// player.on(AudioPlayerStatus.Playing, () => {
			// 	console.log('Ta tocando!');
			// });

			// player.on(AudioPlayerStatus.Idle, () => {
			// 	connection.destroy();
			// });

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
