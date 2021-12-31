const querystring = require('querystring');
const axios = require('axios');
const ytdl = require('ytdl-core');

const opts = {
    maxResults: 10,
    key: process.env?.GOOGLE_API_TOKEN ?? ''
};

const allowedProperties = [
    'fields',
    'channelId',
    'channelType',
    'eventType',
    'forContentOwner',
    'forDeveloper',
    'forMine',
    'location',
    'locationRadius',
    'onBehalfOfContentOwner',
    'order',
    'pageToken',
    'publishedAfter',
    'publishedBefore',
    'regionCode',
    'relatedToVideoId',
    'relevanceLanguage',
    'safeSearch',
    'topicId',
    'type',
    'videoCaption',
    'videoCategoryId',
    'videoDefinition',
    'videoDimension',
    'videoDuration',
    'videoEmbeddable',
    'videoLicense',
    'videoSyndicated',
    'videoType',
    'key'
]

async function search(term, opts) {
    if (!opts) opts = {}

    var params = {
        q: term,
        part: opts.part || 'snippet',
        maxResults: opts.maxResults || 30
    }

    Object.keys(opts).map(function (k) {
        if (allowedProperties.indexOf(k) > -1) params[k] = opts[k]
    })

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(params))
        var result = response.data

        var findings = result.items.map((item) => {
            var link = ''
            var id = ''
            switch (item.id.kind) {
                case 'youtube#channel':
                    link = 'https://www.youtube.com/channel/' + item.id.channelId
                    id = item.id.channelId
                    break
                case 'youtube#playlist':
                    link = 'https://www.youtube.com/playlist?list=' + item.id.playlistId
                    id = item.id.playlistId
                    break
                default:
                    link = 'https://www.youtube.com/watch?v=' + item.id.videoId
                    id = item.id.videoId
                    break
            }

            return {
                id: id,
                link: link,
                kind: item.id.kind,
                publishedAt: item.snippet.publishedAt,
                channelId: item.snippet.channelId,
                channelTitle: item.snippet.channelTitle,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnails: item.snippet.thumbnails
            }
        });

        return findings;
    }
    catch(err) {
        return {
            error: err,
            isError: true
        };
    }
}


module.exports = {
    getVideos: async (searchString) => {
        const results = await search(searchString, opts);
        if (results.isError) {
            throw results?.error ?? results;
        }
        return results.filter(result => result.kind === 'youtube#video');
    },
    getPlaylists: async (searchString) => {
        const results = await search(searchString, opts);
        if (results.isError) {
            throw results?.error ?? results;
        }
        return results.filter(result => result.kind === 'youtube#playlist');
    },
    getVideoStream: (videoLink, quality = 'lowestaudio') => {
        return ytdl(videoLink, { quality });
    }
}
