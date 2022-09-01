const express = require("express");
const UrlModel = require("../models/Url");
const crypto = require("crypto");

const router = express.Router();

const randomString = require("../utils/app");
const { Query } = require("mongoose");

router.get("/random/string/:length", (req, res) => {
    const length = req.params.length ? req.params.length : 5;
    res.status(200).json(randomString(length));
});

router.get("/random/number/:length", (req, res) => {
    const length = req.params.length ? req.params.length : 5;
    res.status(200).json(Math.floor(Math.random()*1000));
});

router.get("/:id", (req, res) => {
    UrlModel.find({ alias: req.params.id }, (err, data) => {
        if (err) res.status(500).json({ error: { message: err.message } });
        else
            res.status(200).json({
                status: true,
                data,
            });
    });
});

router.post("/", async (req, res) => {
    const index = crypto
        .createHash("sha256")
        .update(req.body.link)
        .digest("base64");
    const query = {
        index,
    };

    if (req.body.alias) query.alias = req.body.alias;

    UrlModel.find(query, (err, data) => {
        if (err) res.status(500).json({ error: { message: err.message } });
        else {
            if (data.length > 0)
                res.status(200).json({ status: true, data: data[0] });
            else {
                const alias = req.body.alias
                    ? req.body.alias
                    : randomString(process.env.ALIAS_LENGTH);

                const newUrl = new UrlModel({
                    index,
                    link: req.body.link,
                    alias,
                });

                console.log(newUrl);
                newUrl.save((err) => {
                    if (err)
                        res.status(500).json({
                            status: false,
                            error: { message: "alias is not available" },
                        });
                    else res.status(200).json({ status: true, data: newUrl });
                });
            }
        }
    });
});

router.put("/:alias", (req, res) => {
    //   UrlModel.findOne({ alias: req.params.alias }, (err, data) => {
    //     if (err) res.status(500).json({ error: err.message });
    //     res.status(200).json({
    //       status: "success",
    //       data,
    //     });
    //   });
});

router.delete("/", (req, res) => {});

module.exports = router;