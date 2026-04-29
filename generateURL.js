const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();

const params = {
  Bucket: "music-frontend-nihar",
  Key: "index.html",
  Expires: 3600, // 1 hour
};

const url = s3.getSignedUrl("getObject", params);

console.log("Open this URL:");
console.log(url);