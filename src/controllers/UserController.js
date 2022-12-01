const userServices = require("../services/UserServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async index(_req, res) {
    const user = await userServices.getAll();

    if (user.length < 1)
      return res.status(200).send({ message: "Please, Insert your infos" });

    return res.status(200).json(user);
  },

  async store(req, res) {
    const {
      name,
      userLogin,
      userPassword,
      phone,
      email,
      githubLink,
      linkedlnLink,
      instagramLink,
      aboutMe,
    } = req.body;

    const validation =
      !name ||
      !userLogin ||
      !userPassword ||
      !phone ||
      !email ||
      !githubLink ||
      !linkedlnLink ||
      !instagramLink ||
      !aboutMe;

    if (validation)
      return res
        .status(400)
        .send({ message: "Please, fill in all information" });

    if (userLogin.length > 8 && userPassword.length > 8) {
      if ((await userServices.findByField(userLogin)).length > 0) {
        return res.status(400).send({ message: "Login already existing" });
      }
      req.body.userPassword = await bcrypt.hash(req.body.userPassword, 8);

      const user = await userServices.insertOne(req.body);
      return res.status(200).json({ payload: user });
    } else {
      return res.status(400).send({ message: "Login and passwords invalid" });
    }
  },
  async updateUser(req, res) {
    const name = req.params.name;

    console.log(name);

    const updates = req.body;

    const result = await userServices.updateOne({ name }, updates);

    if (result.matchedCount >= 1) return res.status(200).json(result);
    else return res.status(400).send({ message: "No count matched" });
  },
  async deleteUser(req, res) {
    const user = await userServices.findOneById(req.params.id);

    if (!user) return res.status(400).send({ error: "Id non-existing" });

    await user.remove();

    return res.status(200).send({ message: "success" });
  },

  async authLogin(req, res) {
    const { userLogin, userPassword } = req.body;

    if (!userLogin || !userPassword)
      return res
        .status(400)
        .send({ message: "Please, fill in all information" });

    if (userLogin.length < 8 && userPassword.length < 8)
      return res.status(400).send({ message: "Login and passwords invalid" });

    const user = await userServices.findByField(userLogin);

    const compareHash = await bcrypt.compare(userPassword, user.userPassword);

    if (compareHash) {
      const token = jwt.sign({ payload: user }, req.app.get("secret"));

      res.set("x-access-token", token);
      return res.status(200).send({ message: "success", token });
    } else
      return res.status(406).send({ message: "Username or password invalid!" });
  },
};
