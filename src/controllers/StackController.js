const stackServices = require("../services/StackServices");

module.exports = {
  async index(_req, res) {
    const stacks = await stackServices.getAll();

    if (stacks.length > 0) return res.status(200).json(stacks);
    else
      return res
        .status(200)
        .json({ message: "Let's go work because you do not have nothing" });
  },

  async store(req, res) {
    if (!req.file)
      return res.status(400).send({ message: "Insert a Image Please" });
    const { originalname: imgName, size, key, location: url = "" } = req.file;
    const { name, type } = JSON.parse(req.body.body);

    const sizeMax = 2 * 1024 * 1024;

    if (size > sizeMax)
      return res.status(400).send({ message: "File too large" });

    try {
      const stack = await stackServices.insertOne({
        name,
        type,
        imgName,
        size,
        key,
        url,
      });

      return res.status(200).json(stack);
    } catch (e) {
      return res.status(500).send({ error: e });
    }
  },

  async updateStack(req, res) {
    const stackName = req.params.stackName;

    let update = JSON.parse(req.body.body);
    console.log("Stack update", update);
    const oldStack = await stackServices.getByName(stackName);

    if (!oldStack) return res.status(404).json({ message: "Stack not found" });

    if (req.file && oldStack) {
      const { originalname: imgName, size, key, location: url = "" } = req.file;

      const sizeMax = 2 * 1024 * 1024;

      if (size > sizeMax)
        return res.status(400).send({ message: "File too large" });
      update.imgName = imgName;
      update.size = size;
      update.key = key;
      update.url = url;
      update.oldKey = oldStack.key;
    }

    try {
      const stack = await stackServices.updateOne({ name: stackName }, update);

      return res.status(200).json(stack);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e });
    }
  },

  async deleteStack(req, res) {
    const stack = await stackServices.findOneById(req.params.id);

    if (!stack) return res.status(400).send({ error: "Id non-existing" });

    await stack.remove();

    return res.status(200).send({ message: "success" });
  },
};
