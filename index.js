// External Files
const express = require("express");
const mongoose = require("mongoose");
const doenv = require("dotenv").config();
const ejs = require("ejs");
const path = require("path");

// Internal Files
const urlRouter = require("./Router/urlRouter");

// Database connection
mongoose
    .connect(process.env.DATABASE_CONNECTION_PATH)
    .then(() => console.log("Database connection is ok"))
    .catch((err) => console.log(err.message));

// App module
const app = express();
app.use(express.json());

// set the view engine to ejs
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Router
app.get("/", (req, res) => {
    res.status(200).json({ status: true, message: "welcome" });
});

app.use("/shortener", urlRouter);

// Error Section

// App listening
app.listen(process.env.PORT, () => {
    console.log(`app is listening to http://localhost:${process.env.PORT}`);
});
