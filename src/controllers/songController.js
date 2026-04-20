const dynamoDb = require("../config/aws");

const SONGS_TABLE = process.env.SONGS_TABLE || "music";

// GET /songs
exports.getSongs = async (req, res, next) => {
  try {
    const result = await dynamoDb.scan({
      TableName: SONGS_TABLE,
    }).promise();

    res.status(200).json(result.Items || []);
  } catch (error) {
    next(error);
  }
};