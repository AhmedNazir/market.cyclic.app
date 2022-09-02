const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ error: false, message: "api working" });
});

router.post("/login", async (req, res) => {
    try {
        if (!req.body.username) throw new Error("username is missing");
        if (!req.body.password) throw new Error("Password is missing");

        const user = await User.findOne({ username: req.body.username });
        if (user == null) throw new Error("user is not available");

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isValidPassword) throw new Error("wrong password");

        res.locals.firstname = user.firstname ? user.firstname : "unknown";
        res.locals.lastname = user.lastname ? user.lastname : "unknown";
        res.locals.username = user.username;

        // generate token
        const token = jwt.sign(
            { username: user.username },
            process.env.AUTH_KEY,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            error: false,
            token: token,
            message: "login successful",
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
});

router.post("/signup", async (req, res) => {
    try {
        if (!req.body.username) throw new Error("username is missing");
        if (!req.body.password) throw new Error("Password is missing");

        const hashedPassword = await bcrypt.hash(
            req.body.password,
            parseInt(process.env.BCRYPT_SALTROUNDS)
        );
        req.body.password = hashedPassword;

        const isUserNameExist = await User.find({
            username: req.body.username,
        });
        if (isUserNameExist.length > 0)
            throw new Error("username is not available");

        const newUser = new User(req.body);
        await newUser.save();

        res.status(200).json({ error: false, result: newUser });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
});

module.exports = router;
