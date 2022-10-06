const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  userLogin: String,
  userPassword: String,
  phone: String,
  email: String,
  githubLink: String,
  linkedlnLink: String,
  instagramLink: String,
  aboutMe: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
