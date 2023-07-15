const { YoutubeTranscript } = require("youtube-transcript");
const express = require("express");

const router = express.Router();

router.post("/:videoID", async (req, res) => {
  try {
    const { videoID } = req.params;
    console.log({ videoID });
    const transcripts = await YoutubeTranscript.fetchTranscript(videoID);
    const transcriptsArr = transcripts.map((script) => script.text);
    const returnString = transcriptsArr.join(" ");
    console.log(returnString);
    res.status(200).json({ success: true, transcript: returnString });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
