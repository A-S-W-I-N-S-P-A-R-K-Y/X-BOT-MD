const  { Innertube, UniversalCache, Utils } = require('youtubei.js');
const yts = require("yt-search")
const fs = require("fs")

const validQueryDomains = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'gaming.youtube.com',
  ]);

  const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
  const getURLVideoID = link => {
    const parsed = new URL(link.trim());
    let id = parsed.searchParams.get('v');
    if (validPathDomains.test(link.trim()) && !id) {
      const paths = parsed.pathname.split('/');
      id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
      throw Error('Not a YouTube domain');
    }
    if (!id) {
      throw Error(`No video id found: "${link}"`);
    }
    id = id.substring(0, 11);
    return id;
  };

const downloadMp4 = async (url) => {
    let video_id = getURLVideoID(url);
    try {
        const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
        const stream = await yt.download(video_id, {
            type: 'video+audio', // audio, video or video+audio
            quality: 'bestefficiency', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
            format: 'mp4' // media container format 
          });
          const buffers = [];
          for await (const data of Utils.streamToIterable(stream)) {
            buffers.push(data);
          }
          return Buffer.concat(buffers);
    } catch (e) {
        return "rejected";
    }
};

const getYTInfo = async (url) => {
const video_id = getURLVideoID(url);
const res = await yts({ videoId:video_id })
const {
                                title,
                                description,
                                seconds,
                                uploaddate,
                                views,
                                thumbnail,
                                author,
                                videoId
        } = res
    return ({
                                title,
                                description,
                                seconds,
                                uploaddate,
                                views,
                                thumbnail,
                                author:author.name,
                                videoId
            });
}

module.exports = {
    getYTInfo,
    downloadMp4,
    getURLVideoID,
}
