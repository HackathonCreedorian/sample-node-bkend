const { Project } = require("../models/Project");

module.exports = (app) => {
  app.get("/api/project/all", async (req, res) => {
    let getAllResp = await Project.find({}, '_id name');

    res.send(getAllResp);
  });
};
