const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const projectController = require("./controllers/ProjectController");
const experianceController = require("./controllers/ExperianceController");
const userController = require("./controllers/UserController");
const stackController = require("./controllers/StackController");

// Projects Routes (Create, List All, Delete one)
routes.get("/projects", projectController.index);
routes.post(
  "/project",
  multer(multerConfig).single("file"),
  projectController.store
);
routes.patch(
  "/project/:project",
  multer(multerConfig).single("file"),
  projectController.updateProject
);
routes.delete("/project/:id", projectController.deleteProject);

//Experiance Routes
routes.get("/experiance", experianceController.index);
routes.post("/experiance", experianceController.store);
routes.patch("/experiance/:id", experianceController.updateExperiance);
routes.delete("/experiance/:id", experianceController.deleteExperiance);

//User Routes
routes.get("/user", userController.index);
routes.post("/user", userController.store);
routes.patch("/user/:name", userController.updateUser);
routes.delete("/user/:id", userController.deleteUser);
routes.post("/user/login", userController.authLogin);

//Stacks Routes
routes.get("/stack", stackController.index);

routes.post(
  "/stack",
  multer(multerConfig).single("file"),
  stackController.store
);
routes.patch(
  "/stack/:stackName",
  multer(multerConfig).single("file"),
  stackController.updateStack
);
routes.delete("/stack/:id", stackController.deleteStack);

module.exports = routes;
