var YoutubeMp3Downloader = require("../helpers/youtube-mp3-downloader");
var os = require("os");
const { join } = require("path");

var Downloader = function() {

    var self = this;

    //Configure YoutubeMp3Downloader with your settings 
    self.YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",  // FFmpeg binary location TODO: Set correct path before testing!
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                 // Interval in ms for the progress reports (default: 1000)
        "outputPath": join(__dirname, '../audio_files'),
    });

    self.callbacks = {};

    self.YD.on("finished", function(error, data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

    self.YD.on("error", function(error, data) {

        console.error(error);

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

};

Downloader.prototype.downloadMp3 = function(track, callback) {

  var self = this;

  // Register callback 
  self.callbacks[track.videoId] = callback;
  // Trigger download 
  self.YD.download(track.videoId, track.videoId + '.mp3');
};

module.exports = Downloader;
