const fs = require("fs");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { Deepgram } = require("@deepgram/sdk");
const ffmpeg = require("ffmpeg-static");

const deepgram = new Deepgram("d666c7d4c15f8695c8f9e7d965847aee78eb2d6b");
const YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: "./",
  youtubeVideoQuality: "highestaudio",
});

YD.download("5emJgNiFbAA");

YD.on("progress", (data) => {
  console.log(data.progress.percentage + "% downloaded");
});

YD.on("finished", async (err, video) => {
  const videoFileName = video.file;
  console.log(`Downloaded ${videoFileName}`);

  const file = {
    buffer: fs.readFileSync(videoFileName),
    mimetype: "audio/mp3",
  };
  const options = {
    punctuate: true,
  };

  const result = await deepgram.transcription
    .preRecorded(file, options)
    .catch((e) => console.log(e));
  const transcript = result.results.channels[0].alternatives[0].transcript;

  fs.writeFileSync(
    `${videoFileName}.txt`,
    transcript,
    () => `Wrote ${videoFileName}.txt`
  );
  fs.unlinkSync(videoFileName);
});
