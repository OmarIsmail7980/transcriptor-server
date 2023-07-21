const express = require("express");
const cors = require("cors");
const transcribe = require("./routes/transcribe");
const PORT = 8091;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/transcribe", transcribe);

app.get("/", (req, res) => {
  res.send("App is up and running");
});

app.listen(PORT, () => {
  console.log(`listenning on PORT ${PORT}`);
});
