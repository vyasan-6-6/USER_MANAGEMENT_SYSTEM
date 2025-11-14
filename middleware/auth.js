
const { verifyToken } = require("../helper/jwt");

const isLogin = (req, res, next) => {

    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect("/login");
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("er from islogin:",error.message);
        
        return res.redirect("/login");
    }
};



const isLogout = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            verifyToken(token);
            // ✅ User already logged in → redirect to home
            return res.redirect("/home");
        } catch (error) {
      // ✅ Token invalid → remove it
            res.clearCookie('jwt');
            next();
        }
    } else {   

        next();
    }
};





module.exports = {
    isLogin,
    isLogout
};
