import Express from "express";
import spdl from "spdl-core";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import taglib2 from "taglib2";

const downloadPath = path.resolve(
  __dirname + (process.env.DOWNLOAD_PATH || "../downloads")
);

const app = Express();

app.get("/download/:songId", async (req, res) => {
  const songId = req.params.songId;
  const songInfo = await spdl.getInfo(
    "https://open.spotify.com/track/" + songId
  );
  const song = await spdl(songInfo.url, { quality: "highestaudio" });
  console.log("Downloading: " + songInfo.title);
  song.pipe(
    fs.createWriteStream(`${downloadPath + path.sep + songInfo.title}.mp3`)
  );
  console.log("Writing metadata...");
  taglib2.writeTags(`${downloadPath + path.sep + songInfo.title}.mp3`, {
    title: songInfo.title,
    artist: songInfo.artist,
  });
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
