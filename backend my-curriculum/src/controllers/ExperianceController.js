const experianceServices = require("../services/ExperianceServices");

module.exports = {
  async index(_req, res) {
    const experiances = await experianceServices.getAll();

    if (experiances.length < 1)
      return res.status(200).send({ message: "Go Work!" });

    return res.status(200).json(experiances);
  },
  async store(req, res) {
    const { title, description } = req.body;

    if (!title || !description)
      return res
        .status(200)
        .send({ message: "Please, fill in all information" });

    const experiance = await experianceServices.insertOne(title, description);

    return res.status(200).json(experiance);
  },
  async deleteExperiance(req, res) {
    const experiance = await experianceServices.findOneById(req.params.id);

    if (!experiance) return res.status(400).send({ error: "Id non-existing" });

    await experiance.remove();

    return res.status(200).send({ message: "success" });
  },

  async updateExperiance(req, res) {
    const { id } = req.params;

    const updates = req.body;

    const result = await experianceServices.updateOne({ id }, updates);

    if (result.matchedCount >= 1) return res.status(200).json(result);
    else return res.status(400).send({ message: "No count matched" });
  },
};
