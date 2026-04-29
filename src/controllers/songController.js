const dynamoDb = require("../config/aws");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: "us-east-1",
  signatureVersion: "v4",
});

const SONGS_TABLE = process.env.SONGS_TABLE || "music";
const BUCKET = process.env.S3_BUCKET_NAME || "music-images-nihar";

// attach signed URLs
function attachSignedUrls(items) {
  return items.map((song) => {
    if (!song.image_url) return song;

    const key = song.image_url.split("/").pop();

    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: BUCKET,
      Key: key,
      Expires: 3600,
    });

    return {
      ...song,
      image_url: signedUrl,
    };
  });
}

// GET /songs
exports.getSongs = async (req, res, next) => {
  try {
    const { artist, album, year } = req.query;

    let params;

    if (artist && year) {
      params = {
        TableName: SONGS_TABLE,
        IndexName: "year-index",
        KeyConditionExpression: "artist = :a AND #y = :y",
        ExpressionAttributeNames: {
          "#y": "year",
        },
        ExpressionAttributeValues: {
          ":a": artist,
          ":y": Number(year),
        },
      };
    } else if (artist) {
      params = {
        TableName: SONGS_TABLE,
        KeyConditionExpression: "artist = :a",
        ExpressionAttributeValues: {
          ":a": artist,
        },
      };
    } else if (album) {
      params = {
        TableName: SONGS_TABLE,
        IndexName: "AlbumIndex",
        KeyConditionExpression: "album = :al",
        ExpressionAttributeValues: {
          ":al": album,
        },
      };
    } else {
      return res.status(400).json({
        message: "Please provide artist or album filter",
      });
    }

    const result = await dynamoDb.query(params).promise();

    res.json(attachSignedUrls(result.Items)); // 🔥 IMPORTANT
  } catch (error) {
    next(error);
  }
};
