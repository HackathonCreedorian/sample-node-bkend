const mongoose = require("mongoose");
const { Schema } = mongoose;
const { db } = require("../services/database");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name value not provided"]
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'projects',
    required: [true, "Project value not provided"]
  },
  domain: {
    type: String,
    required: [true, "Domain value not provided"],
    trim: true,
    match: /^(https:\/\/|http:\/\/)([a-zA-Z0-9.-]+)(:[0-9]+)?$/i
  },
  apiPath: {
    type: String,
    required: [true, "API Path value not provided"]
  },
  auth: {
    type: String,
    required: [true, "Auth value not provided"]
  },
  custEntry: [{ type: Schema.Types.ObjectId, ref: 'objects' }],
});

const Product = db.model("products", productSchema);

module.exports = { Product };