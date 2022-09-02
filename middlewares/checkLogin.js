const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkLogin = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.AUTH_KEY);
        const { username } = decoded;
        res.locals.username = username;

        next();
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Authantication failed",
        });
    }
};

module.exports = checkLogin;
