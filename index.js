// External Files
const express = require("express");
const mongoose = require("mongoose");
const doenv = require("dotenv").config();

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

// Set View Engine

// Router

app.use("/", urlRouter);
// Error Section

// App listening
app.listen(process.env.PORT || 3000)
