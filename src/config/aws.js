const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1", // ✅ FIXED
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;
