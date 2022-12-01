const mongoose = require("mongoose");

const ExperianceSchema = mongoose.Schema({
  title: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Experiance", ExperianceSchema);
