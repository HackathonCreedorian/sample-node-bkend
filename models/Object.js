const mongoose = require("mongoose");
const { Schema } = mongoose;
const { db } = require("../services/database");

const objectSchema = new Schema({
  code: { type: String, required: [true, "Name value not provided"] },
  displayNameSingle: { type: String, required: [true, "Display Name (single) value not provided"] },
  displayNamePlural: { type: String, required: [true, "Display Name (plural) value not provided"] },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: [true, "Product value not provided"]
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'projects',
    required: [true, "Project value not provided"]
  },
  fields: {
    type: [String],
    validate: {
      validator: function (array) {
        return array.length > 0;
      },
      message: "At least one field is required in the 'fields' array."
    },
    required: [true, "Fields array cannot be empty"]
  },
  linkWith: { type: String, default: null, required: [true, "Link With value not provided"] },
  linkTo: { type: String, default: null, required: [true, "Link To value not provided"] },
  uiSearchParam: { type: String, default: null, required: [true, "UI Search Param value not provided"] }
});

const ObjectMdl = db.model("objects", objectSchema);

module.exports = { ObjectMdl };
