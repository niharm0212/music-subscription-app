const AWS = require("aws-sdk");
const fs = require("fs");

// ✅ Your region
AWS.config.update({ region: "us-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

// ✅ Correct parsing
const data = JSON.parse(fs.readFileSync("songs.json"));
const songs = data.songs;

async function loadSongs() {
  for (const song of songs) {
    const params = {
      TableName: "music",
      Item: {
        artist: song.artist,
        title: song.title,
        album: song.album,
        year: Number(song.year), // 🔥 convert to number
        image_url: song.img_url, // 🔥 rename field
      },
    };

    try {
      await dynamodb.put(params).promise();
      console.log("Inserted:", song.title);
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

loadSongs();
