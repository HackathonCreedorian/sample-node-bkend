module.exports = (app) => {
  app.get("/api/status", (req, res) => {
    res.send({
      version: "1.0.0",
      name: "Creedorian",
      createdOn: "24-11-2023",
      lastModified: "25-11-2023",
      lastModifiedBy: "Rony Mathews"
    });
  });
};
