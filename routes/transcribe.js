const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const { google } = require("googleapis");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

const apiKey = process.env.API_KEY;
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await youtube.search.list({
      part: "id,snippet",
      q: query,
      type: "video",
      maxResults: 50,
      videoCaption: "closedCaption",
    });

    const videos = response.data.items;
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve videos" });
  }
});

router.get("/:videoID", async (req, res) => {
  try {
    const { videoID } = req.params;
    const transcripts = await YoutubeTranscript.fetchTranscript(videoID,{lang:"en"});
    // const filteredTranscripts = transcripts.filter(
    //   (script) => script.language === "en"
    // ); // Filter transcripts for English language
    const transcriptsArr = transcripts.map((script) => script.text);
    const returnString = transcriptsArr.join(" ");

    res.status(200).json({
      success: true,
      transcript: returnString,
      // transcriptor: filteredTranscripts,
    });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;
