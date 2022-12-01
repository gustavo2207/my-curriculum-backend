const Project = require("../models/Project");

module.exports = {
  async getAll() {
    return Project.find();
  },

  async insertProject(projectFields) {
    return Project.create(projectFields);
  },

  async getById(id) {
    return Project.findById(id);
  },
  async getByTitle(title) {
    return Project.findOne({ title });
  },
  async updateOne(field, updatedInfos) {
    return Project.updateOne(field, { $set: updatedInfos });
  },
};
