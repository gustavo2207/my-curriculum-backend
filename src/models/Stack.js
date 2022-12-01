require("dotenv").config();

const mongoose = require("mongoose");
const aws = require("aws-sdk");

const s3 = new aws.S3();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const StackSchema = new mongoose.Schema({
  name: String,
  type: String,
  imgName: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

StackSchema.pre("save", function () {
  if (!this.url) this.url = `${process.env.APP_URL}/files/${this.key}`;
});

StackSchema.pre("updateOne", function () {
  console.log("updateOne called");
  const accessUpdateObj = this._update["$set"];

  const oldKey = accessUpdateObj.oldKey;

  if (accessUpdateObj.oldKey) {
    delete accessUpdateObj.oldKey;

    if (!accessUpdateObj.url) {
      accessUpdateObj.url = `${process.env.APP_URL}/files/${accessUpdateObj.key}`;
    }
    if (process.env.STORAGE_TYPE === "s3") {
      console.log("i'm updating storage");
      return s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: oldKey,
        })
        .promise();
    } else {
      return promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", oldKey)
      );
    }
  }
});

StackSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key,
      })
      .promise();
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

module.exports = mongoose.model("Stack", StackSchema);
