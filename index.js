// External Files
const express = require("express");
const mongoose = require("mongoose");
const doenv = require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");

// Internal Files
const urlRouter = require("./Router/urlRouter");
const userRouter = require("./Router/userRouter");
const youtubeRouter = require("./Router/youtubeRouter");

// Database connection
mongoose
    .connect(process.env.DATABASE_CONNECTION_PATH)
    .then(() => console.log("Database connection is ok"))
    .catch((err) => console.log(err.message));

// App module
const app = express();
app.use(express.json());
app.use(cors());

// set the view engine to ejs
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Router
app.get("/", (req, res) => {
    res.status(200).json({ status: true, message: "welcome" });
});

app.use("/shortener", urlRouter);
app.use("/user", userRouter);
app.use("/youtube", youtubeRouter);

// Error Section
app.use((req, res, next) => {
    next("Not Found");
});

app.use((err, req, res, next) => {
    if (res.headerSent) next("Multiple header send");
    else {
        const message = err.message || "there is a error";
        res.status(500).json({ error: true, message, err });
    }
});
// App listening
app.listen(process.env.PORT, () => {
    console.log(`app is listening to http://localhost:${process.env.PORT}`);
});
