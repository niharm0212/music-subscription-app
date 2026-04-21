const dynamoDb = require("../config/aws");

const SONGS_TABLE = process.env.SONGS_TABLE || "music";

// GET /songs
exports.getSongs = async (req, res, next) => {
  try {
    const { artist, album, year } = req.query;

    let params;

    //Case 1: artist + year (LSI)
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
          ":y": year,
        },
      };

      const result = await dynamoDb.query(params).promise();
      return res.status(200).json(result.Items);
    }

    //Case 2: artist only (main table)
    if (artist) {
      params = {
        TableName: SONGS_TABLE,
        KeyConditionExpression: "artist = :a",
        ExpressionAttributeValues: {
          ":a": artist,
        },
      };

      const result = await dynamoDb.query(params).promise();
      return res.status(200).json(result.Items);
    }

    // 🔹 Case 3: album (GSI)
    if (album) {
      params = {
        TableName: SONGS_TABLE,
        IndexName: "AlbumIndex",
        KeyConditionExpression: "album = :al",
        ExpressionAttributeValues: {
          ":al": album,
        },
      };

      const result = await dynamoDb.query(params).promise();
      return res.status(200).json(result.Items);
    }

    // 🔹 Case 4: no filters → scan
    const result = await dynamoDb
      .scan({
        TableName: SONGS_TABLE,
      })
      .promise();

    res.status(200).json(result.Items || []);
  } catch (error) {
    next(error);
  }
};
