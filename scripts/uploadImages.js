const AWS = require("aws-sdk");
const axios = require("axios");
const fs = require("fs");

AWS.config.update({ region: "us-west-1" });

const s3 = new AWS.S3();

// ✅ FIX HERE
const data = JSON.parse(fs.readFileSync("songs.json"));
const songs = data.songs;

const BUCKET = "music-images-a2_arnav"; // ⚠️ change this

async function uploadImages() {
  for (const song of songs) {
    try {
      const response = await axios.get(song.img_url, {
        responseType: "arraybuffer",
      });

      const key = `${song.artist}-${song.title}.jpg`;

      await s3
        .upload({
          Bucket: BUCKET,
          Key: key,
          Body: response.data,
          ContentType: "image/jpeg",
        })
        .promise();

      console.log("Uploaded:", key);
    } catch (err) {
      console.error("Error:", song.title, err.message);
    }
  }
}

uploadImages();
