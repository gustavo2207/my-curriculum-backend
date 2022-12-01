const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.headers();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(morgan("dev"));
    this.express.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
    this.express.use(cookieParser());
    this.express.use(cors());
  }

  routes() {
    this.express.use(require("./routes"));
  }

  headers() {
    this.express.set("secret", "your secret pharase here");
  }
}

module.exports = new AppController().express;
