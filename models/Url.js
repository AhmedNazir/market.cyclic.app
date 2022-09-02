const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
    {
        index: { type: String, required: true },
        link: { type: String, required: true },
        alias: { type: String, unique: true, required: true },
        author: { type: String, default: "guest" },
    },
    { timestamps: true }
);

const UrlModel = mongoose.model("url", UrlSchema);

module.exports = UrlModel;
