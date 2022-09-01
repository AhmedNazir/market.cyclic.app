const express = require("express");
const UrlModel = require("../models/Url");
const crypto = require("crypto");

const router = express.Router();

const randomString = require("../utils/app");

router.get("/random/string/:length", (req, res) => {
    const length = req.params.length ? req.params.length : 5;
    res.status(200).json(randomString(length));
});

router.get("/random/number/:length", (req, res) => {
    const length = req.params.length ? req.params.length : 5;
    res.status(200).json(Math.floor(Math.random() * 1000));
});

router.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        message: "welcome!!!",
    });
});

router.get("/:alias", (req, res) => {
    UrlModel.findOne({ alias: req.params.alias }, (err, data) => {
        if (err) res.status(500).json({ error: { message: err.message } });
        else {
            res.status(200).json({
                status: true,
                data,
            });
        }
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

router.put("/", (req, res) => {
    const index = crypto
        .createHash("sha256")
        .update(req.body.link)
        .digest("base64");

    UrlModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
            $set: {
                index: index,
                link: req.body.link,
            },
        },
        {
            new: true,
        },
        (err, data) => {
            if (err) res.json({ status: false });
            else
                res.status(200).json({
                    status: true,
                    data,
                });
        }
    );
});

router.delete("/:id", (req, res) => {
    UrlModel.findByIdAndDelete({ _id: req.params.id }, (err) => {
        if (err) res.json({ status: false });
        else res.status(200).json({ status: true });
    });
});

module.exports = router;
