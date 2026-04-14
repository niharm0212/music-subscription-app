const AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({ region: "us-west-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const songs = JSON.parse(fs.readFileSync("songs.json"));

async function loadSongs() {
  for (const song of songs) {
    const params = {
      TableName: "music",
      Item: {
        artist: song.artist,
        title: song.title,
        album: song.album,
        year: song.year,
        image_url: song.image_url,
      },
    };

    try {
      await dynamodb.put(params).promise();
      console.log("Inserted:", song.title);
    } catch (err) {
      console.error(err);
    }
  }
}

loadSongs();
