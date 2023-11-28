const mongoose = require("mongoose");
const { Schema } = mongoose;
const { db } = require("../services/database");

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name value not provided"]
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  custEntry: {
    type: String,
    required: [true, "Customer Entry value not provided"]
  }
});

const Project = db.model("projects", projectSchema);

module.exports = { Project };
