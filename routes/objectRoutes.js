const mongoose = require("mongoose");

const Project = mongoose.model("projects");
const Objects = mongoose.model("objects");

const { OEC } = require("../helpers/apis");

module.exports = (app) => {
  app.get("/api/object/fields", async (req, res) => {
    if (!req.query.project || !req.query.environment)
      return res.status(400).send({ error: "Missing one or all of the required attributes in body - project, environment" });

    let { project, environment } = req.query;
    let projectId;

    let projectsResp = await Project.find({ name: project }, '_id');
    projectId = projectsResp.length !== 0 ? projectsResp[0]._id : null;

    let productsResp = await Product.find({ project: projectId, environment });

    if(sourceProductNames.includes("OEC")){
      sourceProduct = sourceProducts.find(obj => obj.name === "OEC");
      respList = await OEC.list_contacts(sourceProduct.domain, sourceProduct.auth, sourceProduct.idField, "limit=100");
    } else if(sourceProductNames.includes("OSVC")) {
    }
    respList = respList.data;

    res.send(respList);
  });
};
