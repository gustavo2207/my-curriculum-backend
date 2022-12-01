const Stack = require("../models/Stack");
module.exports = {
  async getAll() {
    return Stack.find();
  },
  async insertOne(projectFields) {
    return Stack.create(projectFields);
  },
  async getByName(name) {
    return Stack.findOne({ name });
  },
  async findOneById(id) {
    return Stack.findById(id);
  },
  async updateOne(field, updatedInfos) {
    return Stack.updateOne(field, { $set: updatedInfos });
  },
};
