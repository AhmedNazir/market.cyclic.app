const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  index: { type: String, required: true },
  link: { type: String, required: true },
  alias: { type: String, unique: true, required: true },
  date: { type: Date, default: Date.now },
});

const UrlModel = mongoose.model("url", UrlSchema);

module.exports = UrlModel;
