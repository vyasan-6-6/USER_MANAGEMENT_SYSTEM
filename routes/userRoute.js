const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../config/multer");
const userController = require("../controllers/userController");

// Register routes
router.get("/register", userController.loadRegister);
router.post("/register", upload.single("image"), userController.insertUser);

// Email verification
router.get("/verify", userController.verifyMail);

// Login routes
router.get("/login", userController.loginLoad);
router.get("/", userController.loginLoad);
router.post("/login", userController.verifyLogin);

// Logout route (protected)
router.get("/logout", auth, userController.userLogout);

// Home (protected)
router.get("/home", auth, userController.loadHome);

// Forgot password routes
router.get("/forget", userController.forgetLoad);
router.post("/forget", userController.forgetVerify);
router.get("/forget-password", userController.forgetPasswordLoad);
router.post("/forget-password", userController.resetPassword);

// Email verification resend
router.get("/verification", userController.verificationLoad);
router.post("/verification", userController.sendVerificationLink);

// Edit profile (protected)
router.get("/edit", auth, userController.editLoad);
router.post("/edit", upload.single("image"), userController.updateProfile);

module.exports = router;
