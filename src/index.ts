import Express from "express";
import spdl from "spdl-core";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { File } from "node-taglib-sharp";
import fetch from "isomorphic-unfetch";
import SpotifyUrlInfo from "spotify-url-info";
const spotify = SpotifyUrlInfo(fetch);
import BodyParser from "body-parser";

const downloadPath = path.resolve(
  __dirname + (process.env.DOWNLOAD_PATH || "../downloads")
);

const app = Express();

app.use(BodyParser.json());

app.get("/download", async (req, res) => {
  if (!req.body || !req.body.songUrl) return res.send("No song url provided!");
  const songUrl = req.body.songUrl;
  if (!spdl.validateURL(songUrl)) return res.send("Invalid song url provided!");
  const songInfo = await spotify.getData(songUrl);
  if (!songInfo || songInfo.type !== "track") return res.send("Invalid song!");
  console.log(songInfo);
  spdl(songUrl, {
    quality: "highestaudio",
  })
    .then(async (song) => {
      console.log("Downloading: " + songInfo.title);
      song.pipe(
        fs.createWriteStream(`${downloadPath + path.sep + songInfo.title}.mp3`)
      );
      console.log("Writing metadata...");
      // @ts-ignore
      const file: File = new File(
        `${downloadPath + path.sep + songInfo.title}.mp3`,
        2
      );
      file.tag.albumArtists = [songInfo.artist];
      file.save();
      res.send("Downloaded!");
    })
    .catch((e) => {
      console.log(e);
      res.send(`Error: ${e.message}`);
    });
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
