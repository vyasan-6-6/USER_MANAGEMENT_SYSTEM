const jwt = require("jsonwebtoken");
const config = require("../config/dbConfig");
const { verifyToken } = require("../helper/jwt");

const auth = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("Token in cookie:", req.cookies.jwt);
    console.log("Cookies:", req.cookies);

    if (!token) {
        return res.redirect("/users/home");
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("er from auth :", error.message);
        return res.redirect("/users/login");
    }
};
module.exports = auth;
