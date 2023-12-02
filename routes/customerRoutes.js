const { Project } = require("../models/Project");
const { Product } = require("../models/Product");
const { ObjectMdl } = require("../models/Object");
const { OEC, OSVC, GENERAL } = require("../helpers/apis");
const { generateFindParams, formatResponseSearch, formatResponseDetails } = require("../helpers/utils");

function selectApiGroup(objName) {
  switch (objName) {
    case "OEC":
      return OEC;
    case "OSVC":
      return OSVC;
    default:
      break;
  }
}

module.exports = (app) => {
  app.get("/api/customer", async (req, res) => {
    if (!req.query.project)
      return res.status(400).send({ error: "Missing one or all of the required attributes in query - project" });

    let { project, searchText = null } = req.query, records = [];
    let projectsResp = await Project.findById(project);
    let productsResp = await Product.find({ name: projectsResp.custEntry, project: projectsResp._id });
    let objectsResp = await ObjectMdl.findById(productsResp[0].custEntry);

    let fields = objectsResp.fields.map(field => field.includes("?") ? field.split("?")[0] : field);
    fields = fields.join(',');

    if (!searchText) {
      records = await selectApiGroup(projectsResp.custEntry).list_contacts(productsResp[0].domain, productsResp[0].auth, "limit=50", `fields=${fields}`);
    } else {
      const qParam = `q=${objectsResp.uiSearchParam}=${searchText}`;
      records = await selectApiGroup(projectsResp.custEntry).find_contacts(productsResp[0].domain, productsResp[0].auth, qParam, "limit=50", `fields=${fields}`);
    }

    const response = formatResponseSearch(records.data.items, objectsResp.fields, objectsResp.uiSearchParam, projectsResp.custEntry);
    res.send({ ...response });
  });

  app.get("/api/customer/:uiSearchParam", async (req, res) => {
    if (!req.query.project)
      return res.status(400).send({ error: "Missing one or all of the required attributes in query - project" });

    const { uiSearchParam } = req.params, { project } = req.query;
    let results = {}, sourceProduct = null, sourceObject = null, prod_id_details_Map = {}, sourceEntry;

    let [proj, prods, objs] = await Promise.all([
      Project.findById(project), Product.find({ project }), ObjectMdl.find({ project })
    ]);

    prods.forEach(product => {
      prod_id_details_Map[product._id] = { ...product._doc };
      delete prod_id_details_Map[product._id]._id;
      delete prod_id_details_Map[product._id].project;
      if (product.custEntry !== null) sourceProduct = product;
    });
    objs.forEach(obj => {
      if (obj.uiSearchParam !== null) sourceObject = obj;
    });

    // API Group 1 - Source Object
    const srcObjParams = generateFindParams(1, uiSearchParam, sourceObject, null, sourceObject, sourceProduct, prod_id_details_Map);
    let srcObjResp = await GENERAL.find(
      srcObjParams.auth, srcObjParams.domain, srcObjParams.apiPath, srcObjParams.object, srcObjParams.query, srcObjParams.fields, srcObjParams.headers
    );
    sourceEntry = formatResponseDetails(sourceProduct, srcObjResp, sourceObject.fields);
    results[`${sourceProduct.name}/${sourceObject.displayNamePlural}`] = sourceEntry;

    // API Group 2 - Source Product Objects
    let srcPrdObjApis = [], count = 0;
    objs.forEach((obj, index) => {
      // console.log({ 
      //   index,
      //   "obj.code": obj.code, "obj.product": obj.product, "sourceProduct._id": sourceProduct._id, "obj._id": obj._id,
      //   "sourceObject._id": sourceObject._id, "condition_1": obj.product.toString() === sourceProduct._id.toString(), "condition_2": obj._id !== sourceObject._id
      // });

      if (obj.product.toString() === sourceProduct._id.toString() && obj._id !== sourceObject._id) {
        const srcPrdObjParams = generateFindParams(2, uiSearchParam, obj, sourceEntry, sourceObject, sourceProduct, prod_id_details_Map);
        console.log(srcPrdObjParams, " : srcPrdObjParams");
        srcPrdObjApis.push(GENERAL.find(
          srcPrdObjParams.auth, srcPrdObjParams.domain, srcPrdObjParams.apiPath, srcPrdObjParams.object, srcPrdObjParams.query, srcPrdObjParams.fields, srcPrdObjParams.headers
        ));
        // results[`${prod_id_details_Map[obj.product].name}/${obj.displayNamePlural}`] = null;
      }
    });
    const srcPrdObjResults = await Promise.all(srcPrdObjApis);
    objs.forEach((obj) => {
      if (obj.product.toString() === sourceProduct._id.toString() && obj._id !== sourceObject._id) {
        // results[`${prod_id_details_Map[obj.product].name}/${obj.displayNamePlural}`] = srcPrdObjResults[count++].data.items;
        results[`${prod_id_details_Map[obj.product].name}/${obj.displayNamePlural}`] = formatResponseDetails(sourceProduct, srcPrdObjResults[count++], obj.fields);
      }
    });

    // API Group 3 - Other Product Objects
    let othPrdObjApis = [];
    count = 0;
    objs.forEach((obj, index) => {
      // console.log({ 
      //   index,
      //   "obj.code": obj.code, "obj.product": obj.product, "sourceProduct._id": sourceProduct._id, "obj._id": obj._id,
      //   "sourceObject._id": sourceObject._id, "condition_1": obj.product.toString() === sourceProduct._id.toString(), "condition_2": obj._id !== sourceObject._id
      // });

      if (obj.product.toString() !== sourceProduct._id.toString()) {
        const othPrdObjParams = generateFindParams(2, uiSearchParam, obj, sourceEntry, sourceObject, sourceProduct, prod_id_details_Map);
        console.log(othPrdObjParams, " : othPrdObjParams");
        othPrdObjApis.push(GENERAL.find(
          othPrdObjParams.auth, othPrdObjParams.domain, othPrdObjParams.apiPath, othPrdObjParams.object, othPrdObjParams.query, othPrdObjParams.fields, othPrdObjParams.headers
        ));
        // results[`${prod_id_details_Map[obj.product].name}/${obj.displayNamePlural}`] = null;
      }
    });
    const othPrdObjResults = await Promise.all(othPrdObjApis);
    objs.forEach((obj) => {
      if (obj.product.toString() !== sourceProduct._id.toString()) {
        results[`${prod_id_details_Map[obj.product].name}/${obj.displayNamePlural}`] = othPrdObjResults[count++].data.items;
      }
    });

    res.send({ 
      srcObject: sourceObject, 
      srcProduct: sourceProduct, 
      srcEntry: sourceEntry,
      results
    });
  });
};