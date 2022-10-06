const projectService = require("../services/ProjectServices");

require("dotenv").config();
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const crypto = require("crypto");
const aws = require("aws-sdk");
const StackServices = require("../services/StackServices");

async function routeService(whatRoute, reqObj) {
  switch (whatRoute) {
    case whatRoute === "stack":
      console.log("Stack");
      return StackServices.getByName(reqObj.stackName);
    case whatRoute === "project":
      console.log("project");
      return projectService.getByTitle(reqObj.project);
    default:
      return undefined;
  }
}

const storageTypes = {
  local: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (_req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, file.key);
      });
    },
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (_req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, fileName);
      });
    },
  }),
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: async (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    const whatRoute = req.originalUrl.split("/")[1];

    const oldData = routeService(whatRoute, req.params);
    const error = new multer.MulterError(404);
    error.message = `${whatRoute} not found`;

    if (allowedMimes.includes(file.mimetype)) {
      if (req.method === "PATCH") {
        if (oldData) callback(null, true);
        else callback(error);
      }
      if (req.method === "POST") callback(null, true);
    } else {
      callback(new Error("Invalid file type."));
    }
  },
};
