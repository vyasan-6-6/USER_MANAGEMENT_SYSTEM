const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/adminAuth");
const upload = require("../config/multer");

// ------------------------------
// LOGIN / LOGOUT
// ------------------------------
router.get("/", auth.isLogout, adminController.loadLogin);
router.post("/", adminController.loginVerify);
router.get("/logout", auth.isLogin, adminController.logout);

// ------------------------------
// DASHBOARD & USERS
// ------------------------------
router.get("/home", auth.isLogin, adminController.loadDashBoard);
router.get("/dashboard", auth.isLogin, adminController.adminDashboard);

router.get("/new-user", auth.isLogin, adminController.newUserLoad);
router.post("/new-user", auth.isLogin, upload.single("image"), adminController.addUser);

router.get("/edit-user", auth.isLogin, adminController.editUserLoad);
router.post("/edit-user", auth.isLogin, adminController.updateUsers);

router.get("/delete-user", auth.isLogin, adminController.deleteUser);

// ------------------------------
// FORGOT PASSWORD
// ------------------------------
router.get("/forget", auth.isLogout, adminController.forgetLoad);
router.post("/forget", adminController.forgetVerify);
router.get("/forget-password", auth.isLogout, adminController.forgetPasswordLoad);
router.post("/forget-password", adminController.resetPassword);

// ------------------------------
// 404 HANDLER
// ------------------------------
router.use((req, res) => {
    res.status(404).render("admin/404", { message: "Page not found" });
});
module.exports = router;
