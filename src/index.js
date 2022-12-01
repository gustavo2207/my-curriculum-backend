require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

/**
 * Database setup
 */
mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
});

app.listen(3000);
