const AWS = require("aws-sdk");
const axios = require("axios");
const fs = require("fs");

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const BUCKET = "music-images-nihar";
const TABLE = "music";

// Load dataset
const data = JSON.parse(fs.readFileSync("songs.json"));
const songs = data.songs;

async function uploadAndUpdate() {
  for (const song of songs) {
    try {
      // 1. Download image
      const response = await axios.get(song.img_url, {
        responseType: "arraybuffer",
      });

      // 2. CLEAN NAME FIRST (IMPORTANT)
      const cleanName = `${song.artist}-${song.title}`
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "");

      // 3. ADD EXTENSION AFTER CLEANING ✅
      const key = cleanName + ".jpg";

      // 4. Upload to S3
      await s3
        .upload({
          Bucket: BUCKET,
          Key: key,
          Body: response.data,
          ContentType: "image/jpeg",
        })
        .promise();

      console.log("Uploaded:", key);

      // 5. Generate correct S3 URL
      const s3Url = `https://${BUCKET}.s3.amazonaws.com/${key}`;

      // 6. Update DynamoDB
      await dynamoDb
        .update({
          TableName: TABLE,
          Key: {
            artist: song.artist,
            title: song.title,
          },
          UpdateExpression: "SET image_url = :url",
          ExpressionAttributeValues: {
            ":url": s3Url,
          },
        })
        .promise();

      console.log("Updated DB:", song.title);
    } catch (err) {
      console.error("Error:", song.title, err.message);
    }
  }
}

uploadAndUpdate();
