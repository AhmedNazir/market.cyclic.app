const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
