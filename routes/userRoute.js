const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../config/multer");
const userController = require("../controllers/userController");

// Register routes
router.get("/register",auth.isLogout,userController.loadRegister);
router.post("/register", upload.single("image"), userController.insertUser);

// Email verification
router.get("/verify", userController.verifyMail);

// Login routes
router.get("/login", auth.isLogout,userController.loginLoad);
router.get("/",auth.isLogout,userController.loginLoad);
router.post("/login", userController.verifyLogin);

// Logout route (protected)
router.get("/logout", auth.isLogin, userController.userLogout);

// Home (protected)
router.get("/home", auth.isLogin, userController.loadHome);

// Forgot password routes
router.get("/forget", userController.forgetLoad);
router.post("/forget", userController.forgetVerify);
router.get("/forget-password", userController.forgetPasswordLoad);
router.post("/forget-password", userController.resetPassword);

// Email verification resend
router.get("/verification", userController.verificationLoad);
router.post("/verification", userController.sendVerificationLink);

// Edit profile (protected)
router.get("/edit", auth.isLogin, userController.editLoad);
router.post("/edit", upload.single("image"), userController.updateProfile);

module.exports = router;
