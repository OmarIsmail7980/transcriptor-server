const fs = require("fs");
const youtubeMp3Downloader = require("youtube-mp3-downloader");
const { Deepgram } = require("@deepgram/sdk");
const ffmpeg = require("ffmpeg-static");

const download = new youtubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: "./output",
  youtubeVideoQuality: "highestaudio",
});

const deepgram = new Deepgram("b412a00bc8ae425d901b931e0ff20c688b3ca03d");

download.download("48h57PspBec");

download.on("finished", async (err, video) => {
  const videoFileName = video.file;
  console.log("videoFile has been downloaded");

  const result = await deepgram.transcription.preRecorded({
    buffer: fs.readFileSync(videoFileName),
    mimetype: "audio/mp3",
  },{punctuate:true, utterances:true});

  console.log(result.toWebVTT);
});
