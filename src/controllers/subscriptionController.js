const dynamoDb = require("../config/aws");

const SONGS_TABLE = process.env.SONGS_TABLE || "music";
const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE || "subscriptions";

// POST /subscribe
exports.subscribe = async (req, res, next) => {
  try {
    const { email, title } = req.body;

    if (!email || !title) {
      throw new Error("Email and title are required");
    }

    // Find song by title using GSI
    const songResult = await dynamoDb.query({
      TableName: SONGS_TABLE,
      IndexName: "title-index",
      KeyConditionExpression: "title = :title",
      ExpressionAttributeValues: {
        ":title": title,
      },
    }).promise();

    const song = songResult.Items && songResult.Items[0];

    if (!song) {
      throw new Error("Song not found");
    }

    // Check if already subscribed
    const existing = await dynamoDb.get({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: {
        email,
        title,
      },
    }).promise();

    if (existing.Item) {
      throw new Error("Already subscribed to this song");
    }

    // Add subscription
    const subscriptionItem = {
      email,
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      image_url: song.image_url,
    };

    await dynamoDb.put({
      TableName: SUBSCRIPTIONS_TABLE,
      Item: subscriptionItem,
    }).promise();

    res.status(201).json({
      message: "Subscribed successfully",
      subscription: subscriptionItem,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /subscribe
exports.unsubscribe = async (req, res, next) => {
  try {
    const { email, title } = req.body;

    if (!email || !title) {
      throw new Error("Email and title are required");
    }

    const existing = await dynamoDb.get({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: {
        email,
        title,
      },
    }).promise();

    if (!existing.Item) {
      throw new Error("Subscription not found");
    }

    await dynamoDb.delete({
      TableName: SUBSCRIPTIONS_TABLE,
      Key: {
        email,
        title,
      },
    }).promise();

    res.status(200).json({
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /subscriptions?email=user1@gmail.com
exports.getSubscriptions = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new Error("Email is required");
    }

    const result = await dynamoDb.query({
      TableName: SUBSCRIPTIONS_TABLE,
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    }).promise();

    res.status(200).json(result.Items || []);
  } catch (error) {
    next(error);
  }
};