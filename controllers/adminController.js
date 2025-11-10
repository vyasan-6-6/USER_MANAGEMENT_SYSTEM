const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");
const config = require("../config/multer");
const { generateAdminToken } = require("../helper/admin_jwt");

const securePassword = async (password) => {
    try {
        console.log("Password before hashing:", password);

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log("er from secure password:", error.message);
    }
};

const sendResetPasswordMail = async (name, email, token) => {
    try {
        // ✅ Create transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.HOST, // Gmail SMTP host
            port: 465, // Port 465 for SSL (or 587 for TLS)
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS, // your App Password
            },
            tls: {
                rejectUnauthorized: false, // helps avoid self-signed cert errors in dev
            },
        });

        // ✅ Email options
        const mailOptions = {
            from: process.env.HOST,
            to: email,
            subject: "For reset password",
            html: `
        <p>Hi ${name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="http://localhost:8000/admin/forget-password?token=${token}">Reset  Your Password</a>
        `,
        };

        // ✅ Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.response);
    } catch (error) {
        console.log("Error sending email:", error.message);
    }
};

const addUserMail = async (name, email, password, user_id) => {
    try {
        // ✅ Create transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.HOST, // Gmail SMTP host
            port: 465, // Port 465 for SSL (or 587 for TLS)
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS, // your App Password
            },
            tls: {
                rejectUnauthorized: false, // helps avoid self-signed cert errors in dev
            },
        });

        // ✅ Email options
        const mailOptions = {
            from: config.userEmail,
            to: email,
            subject: "Admin Add You and Verify Your Mail.",
            html: `
        <p>Hi ${name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="http://localhost:8000/verify?id=${user_id}">Verify Email</a> <br><b>Email:-</b>${email}<br><b>Password:-</b>${password}
      `,
        };

        // ✅ Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.response);
    } catch (error) {
        console.log("Error sending email:", error.message);
    }
};

const loadLogin = async (req, res) => {
    try {
        const adminId = req.userId;
        const adminData = await User.findById(adminId);

        if (!adminData) {
            return res.render("admin/login"); // ✅ stop here
        }

        res.render("admin/login");
    } catch (error) {
        console.log(error.message);
    };
};

const loginVerify = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.render("admin/login", { message: "Invalid email or password." });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.render("admin/login", { message: "Invalid email or password." });
        }

        if (userData.is_admin === 0) {
            return res.render("admin/login", { message: "Access denied." });
        }

        // // ✅ Store admin session if using session
        // req.session.admin_id = userData._id;

        const token = generateAdminToken(userData._id);
        res.cookie("admin_jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // ✅ Correct redirection
        res.redirect("/admin/home");
    } catch (error) {
        console.log("Error from verify login:", error.message);
        res.render("admin/login", { message: "Something went wrong. Please try again." });
    }
};

const loadDashBoard = async (req, res) => {
    try {
        const admin_id = req.userId;
        const adminData = await User.findById(admin_id);

        res.render("admin/home", { adminData });
    } catch (error) {
        console.log("err from load dash board :", error.message);
    }
};

// ✅ Logout (clear cookie)
const logout = async (req, res) => {
    try {
        res.clearCookie("admin_jwt");
        res.redirect("/admin");
    } catch (error) {
        console.log("logout Error:", error.message);
    }
};

// while using session
// const logout = async (req, res) => {
//     try {
//         req.session.destroy();
//         res.redirect("/admin");
//     } catch (error) {
//         console.log("logout Error:", error.message);
//     }
// };



const forgetLoad = async (req, res) => {
    try {
        res.render("admin/forget");
    } catch (error) {
        console.log(error.message);
    }
};

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            if (userData.is_Admin === 0) {
                res.render("admin/forget", { message: "Email is incorrect" });
            } else {
                const randomstring = randomString.generate();
                await User.updateOne({ email: email }, { $set: { token: randomstring } });
                sendResetPasswordMail(userData.name, userData.email, randomstring);
                res.render("admin/forget", { message: "Please check your email to reset your password." });
            }
        } else {
            res.render("admin/forget", { message: "Email is incorrect" });
        }
    } catch (error) {
        console.log("err from forget verify :", error.message);
    }
};

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });
        if (tokenData) {
            res.render("admin/forget-password", { user_id: tokenData._id });
        } else {
            res.render("admin/404", { message: "Invalid Link" });
        }
    } catch (error) {
        console.log("err from forget password load :", error.message);
    }
};

const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        console.log("Password from request:", req.body.password);

        const secure_password = await securePassword(password);
        await User.findByIdAndUpdate({ _id: user_id }, { password: secure_password, token: "" });
        res.redirect("admin/");
    } catch (error) {
        console.log("er from reset password:", error.message);
    }
};

const adminDashboard = async (req, res) => {
    try {
        const userData = await User.find({ is_Admin: 0 });

        res.render("admin/dashboard", { users: userData });
    } catch (error) {
        console.log("err from adminboard:", error.message);
    }
};

const newUserLoad = async (req, res) => {
    try {
        res.render("admin/new-user");
    } catch (error) {
        console.log("er from new user load :", error.message);
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, mno } = req.body;
        const image = req.file.filename;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.render("admin/new-user", { message: "The email already exists , Please use  another email." });
        }

        const password = randomString.generate(8);
        const spassword = await securePassword(password);
        const user = new User({
            name: name,
            email: email,
            mobile: mno,
            image: image,
            password: spassword,
            is_Admin: 0,
        });

        const userData = await user.save();

        if (userData) {
            addUserMail(name, email, password, userData._id);
            res.redirect("/admin/dashboard");
        } else {
            res.render("admin/new-user", { message: "Something  went wrong." });
        }
    } catch (error) {
        console.log("err from add user :", error.message);
    }
};

const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render("admin/edit-user", { users: userData });
        } else {
            res.render("/admin/dashboard");
        }
    } catch (error) {
        console.log("er from :", error.message);
    }
};

const updateUsers = async (req, res) => {
    try {
        const id = req.body.id;
        let updateData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            is_verified: req.body.verify,
        };

        await User.findByIdAndUpdate({ _id: id }, { $set: updateData });

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log("er from update users :", error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id: id });

        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log("er from delete user :", error.message);
    }
};

module.exports = {
    loadLogin,
    loginVerify,
    loadDashBoard,
    logout,
    forgetLoad,
    forgetVerify,
    sendResetPasswordMail,
    forgetPasswordLoad,
    resetPassword,
    securePassword,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
};
