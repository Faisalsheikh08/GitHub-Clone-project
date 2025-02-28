const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWSACCESSKEYID,
  secretAccessKey: process.env.AWSSECRETACCESSKEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const S3_BUCKET = "fssgithubbucket";

module.exports = { s3, S3_BUCKET };
