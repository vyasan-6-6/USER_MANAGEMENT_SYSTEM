const jwt = require("jsonwebtoken");

 
 

const generateAdminToken = (id) =>{
    return jwt.sign({id, role : "admin"},process.env.ADMIN_JWT_SECRET,{
        expiresIn:"1d"
    });
};

const verifyAdminToken = (token) =>{
    return jwt.verify(token,config.process.env.ADMIN_JWT_SECRET);
};

module.exports = {
    generateAdminToken,
    verifyAdminToken
}