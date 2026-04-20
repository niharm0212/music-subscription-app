const AWS = require("aws-sdk");

// Configure AWS region
AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
});

// Create DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;