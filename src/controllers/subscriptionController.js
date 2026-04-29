const dynamoDb = require("../config/aws");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: "us-east-1",
  signatureVersion: "v4",
});

const SONGS_TABLE = process.env.SONGS_TABLE || "music";
const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE || "subscriptions";
const BUCKET = process.env.S3_BUCKET_NAME || "music-images-nihar";

// Attach signed URLs
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

// POST /subscribe
const subscribe = async (req, res, next) => {
  try {
    const { email, title } = req.body;

    if (!email || !title) {
      throw new Error("Email and title are required");
    }

    const songResult = await dynamoDb
      .query({
        TableName: SONGS_TABLE,
        IndexName: "title-index",
        KeyConditionExpression: "title = :title",
        ExpressionAttributeValues: {
          ":title": title,
        },
      })
      .promise();

    const song = songResult.Items && songResult.Items[0];

    if (!song) {
      throw new Error("Song not found");
    }

    const existing = await dynamoDb
      .get({
        TableName: SUBSCRIPTIONS_TABLE,
        Key: { email, title },
      })
      .promise();

    if (existing.Item) {
      throw new Error("Already subscribed");
    }

    await dynamoDb
      .put({
        TableName: SUBSCRIPTIONS_TABLE,
        Item: {
          email,
          title: song.title,
          artist: song.artist,
          album: song.album,
          year: song.year,
          image_url: song.image_url,
        },
      })
      .promise();

    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    next(error);
  }
};

// DELETE /subscribe
const unsubscribe = async (req, res, next) => {
  try {
    const { email, title } = req.body;

    await dynamoDb
      .delete({
        TableName: SUBSCRIPTIONS_TABLE,
        Key: { email, title },
      })
      .promise();

    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /subscriptions
const getSubscriptions = async (req, res, next) => {
  try {
    const { email } = req.query;

    const result = await dynamoDb
      .query({
        TableName: SUBSCRIPTIONS_TABLE,
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
      .promise();

    res.json(attachSignedUrls(result.Items));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscriptions,
};
