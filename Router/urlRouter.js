const express = require("express");
const UrlModel = require("../models/Url");
const crypto = require("crypto");

const randomString = require("../utils/app");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/random/string/:length", (req, res) => {
    const length = req.params.length ? req.params.length : 5;
    res.status(200).json(randomString(length));
});

router.get("/random/number/:length", (req, res) => {
    const length = req.params.length ? req.params.length : 5;
    res.status(200).json(Math.floor(Math.random() * 1000));
});

router.get("/add", checkLogin, (req, res) => {
    const index = crypto
        .createHash("sha256")
        .update(req.query.link)
        .digest("base64");

    const query = { index };
    if (req.query.alias) query.alias = req.query.alias;

    console.log(req.query);

    UrlModel.find(query, (err, data) => {
        if (err) res.status(500).json({ error: { message: err.message } });
        else {
            if (data.length > 0)
                res.status(200).json({ status: true, data: data[0] });
            else {
                const alias = req.query.alias
                    ? req.query.alias
                    : randomString(process.env.ALIAS_LENGTH);

                const newUrl = new UrlModel({
                    index,
                    link: req.query.link,
                    alias,
                    author: res.locals.username,
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

router.get("/all", checkLogin, (req, res) => {
    UrlModel.find(
        { author: res.locals.username },
        { index: 0, __v: 0 },
        (error, data) => {
            if (error)
                res.status(500).json({
                    error: true,
                    message: error.message,
                });
            else
                res.status(200).json({
                    error: false,
                    username: res.locals.username,
                    data,
                });
        }
    );

    // try {
    //     const result = UrlModel.find({ author: res.locals.username }).exec();

    //     res.status(200).json({
    //         error: false,
    //         username: res.locals.username,
    //         data: result,
    //     });
    // } catch (error) {
    //     res.status(500).json({
    //         error: true,
    //         message: error.message,
    //     });
    // }
});

router.get("/:alias", (req, res) => {
    UrlModel.findOne(
        { alias: req.params.alias },
        { index: 0, _id: 0, __v: 0 },
        (err, data) => {
            if (err) res.status(500).json({ error: { message: err.message } });
            else {
                res.status(200).json({
                    status: true,
                    data,
                });
            }
        }
    );
});

router.get("/", (req, res) => {
    res.status(200).json({ error: false, message: "api working" });
    // res.render("url");
});

router.post("/", (req, res) => {
    const index = crypto
        .createHash("sha256")
        .update(req.body.link)
        .digest("base64");

    const query = { index };
    if (req.body.alias) query.alias = req.body.alias;

    console.log(req.body);

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
