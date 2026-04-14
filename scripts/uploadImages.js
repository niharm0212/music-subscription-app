const AWS = require("aws-sdk");
const axios = require("axios");
const fs = require("fs");

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();

const songs = JSON.parse(fs.readFileSync("songs.json"));

const BUCKET = "your-bucket-name"; // change this

async function uploadImages() {
  for (const song of songs) {
    try {
      const response = await axios.get(song.image_url, {
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
      console.error(err);
    }
  }
}

uploadImages();
