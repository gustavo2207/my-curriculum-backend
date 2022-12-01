const User = require("../models/User");

module.exports = {
  async insertOne({
    name,
    userLogin,
    userPassword,
    phone,
    email,
    githubLink,
    linkedlnLink,
    instagramLink,
    aboutMe,
  }) {
    return await User.create({
      name,
      userLogin,
      userPassword,
      phone,
      email,
      githubLink,
      linkedlnLink,
      instagramLink,
      aboutMe,
    });
  },

  async getAll() {
    return await User.find();
  },

  async findOneById(id) {
    return await User.findById(id);
  },

  async updateOne(field, updatedInfos) {
    return await User.updateOne(field, { $set: updatedInfos });
  },
  async findByField(field) {
    console.log(field);
    console.log(await User.find({ userLogin: { $eq: field } }));
    return await User.find({ userLogin: { $eq: field } });
  },
};
