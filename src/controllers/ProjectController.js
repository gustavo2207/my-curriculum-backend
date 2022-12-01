const projectServices = require("../services/ProjectServices");

module.exports = {
  async index(_req, res) {
    const projects = await projectServices.getAll();

    if (projects.length > 0) return res.status(200).json(projects);
    else
      return res
        .status(200)
        .json({ message: "Let's go work because you do not have nothing" });
  },

  async store(req, res) {
    if (!req.file)
      return res.status(400).send({ message: "Insert a Image Please" });
    const { originalname: imgName, size, key, location: url = "" } = req.file;
    const { title, description, urlProject, urlGithub } = JSON.parse(
      req.body.body
    );

    const sizeMax = 2 * 1024 * 1024;

    if (size > sizeMax)
      return res.status(400).send({ message: "File too large" });

    try {
      const project = await projectServices.insertProject({
        title,
        description,
        urlProject,
        urlGithub,
        imgName,
        size,
        key,
        url,
      });

      return res.status(200).json(project);
    } catch (e) {
      return res.status(500).send({ error: e });
    }
  },

  async updateProject(req, res) {
    const projectTitle = req.params.project;
    let update = JSON.parse(req.body.body);
    const oldProject = await projectServices.getByTitle(projectTitle);

    if (!oldProject)
      return res.status(404).json({ message: "Project not found" });

    if (req.file) {
      const { originalname: imgName, size, key, location: url = "" } = req.file;

      const sizeMax = 2 * 1024 * 1024;

      if (size > sizeMax)
        return res.status(400).send({ message: "File too large" });
      update.imgName = imgName;
      update.size = size;
      update.key = key;
      update.url = url;
      update.oldKey = oldProject.key;
    }

    try {
      const project = await projectServices.updateOne(
        { title: projectTitle },
        update
      );

      return res.status(200).json(project);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e });
    }
  },

  async deleteProject(req, res) {
    const project = await projectServices.getById(req.params.id);

    if (!project) return res.status(400).send({ error: "Id non-existing" });

    await project.remove();

    return res.status(200).send({ message: "success" });
  },
};
