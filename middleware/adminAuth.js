// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

exports.isLogin = (req, res, next) => {
    try {
        const token = req.cookies.admin_jwt;
        if (!token) {
            return res.redirect("/admin"); // not logged in
        }

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.userId = decoded.id; // ✅ make available to controllers
        next();
    } catch (err) {
        console.log("JWT verify failed:", err.message);
        res.clearCookie("admin_jwt");
        return res.redirect("/admin");
    }
};

exports.isLogout = (req, res, next) => {
    try {
        const token = req.cookies.admin_jwt;
        if (token) {
            // Already logged in → redirect to dashboard
            return res.redirect("/admin/home");
        }
        next();
    } catch (err) {
        console.log("Logout check error:", err.message);
        next();
    }
};
