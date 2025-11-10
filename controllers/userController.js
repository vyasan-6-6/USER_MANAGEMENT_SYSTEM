const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomsString = require("randomstring");
const { createToken } = require("../helper/jwt");

 
const securePassword = async(password)=>{
    try {
       const passwordHash =  await bcrypt.hash(password,10);
       return passwordHash;
    } catch (error) {
        console.log("er from pass hash :",error.message);
        
    }
}

//for send mail .

const sendVerifyMail = async (name, email, user_id) => {
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
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            html: `
        <p>Hi ${name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="http://localhost:8000/verify?id=${user_id}">Verify Email</a>
      `,
        };

        // ✅ Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.response);
    } catch (error) {
        console.log("Error sending email:", error.message);
    }
};

//for reset password send mail

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
        <a href="http://localhost:8000/forget-password?token=${token}">Reset  Your Password</a>
      `,
        };

        // ✅ Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.response);
    } catch (error) {
        console.log("Error sending email:", error.message);
    }
};

const loadRegister = async (req, res) => {
    try {
        res.render("users/registration");
    } catch (error) {
        console.log("load registration error:", error.message);
    }
};

const insertUser = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.render("users/registration", { errorMessage: "The email already exists , Please use  another email." });
        }

        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            password: spassword,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            is_Admin: 0,
        });

        const userData = await user.save();
        if (userData) {
            console.log(req.body);

            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render("users/registration", {
                successMessage: "The Registration has been Successfully Completed , Please verify your Email.",
            });
        } else {
            res.render("registration", { message: "The Registration has been Successfully Failed." });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const verifyMail = async (req, res) => {
    try {
        console.log("mm", req.query.id);

        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

        console.log(updateInfo);

        if (updateInfo.matchedCount === 0) {
            return res.render("users/email-verified", { message: "Invalid verification link." });
        }

        res.render("users/email-verified", { message: "Your email has been successfully verified!" });
    } catch (error) {
        console.log("error from email verification:", error.message);
        res.render("users/email-verified", { message: "Something went wrong during verification." });
    }
};

//Login user method started

const loginLoad = async (req, res) => {
    try {
        res.render("users/login");
    } catch (error) {
        console.log( "er from login load :  ",error.message);
    }
};

// ✅ Verify Login Controller
const verifyLogin = async (req, res) => {
    try {
        // Log request body to check if data is coming from the form correctly
        // console.log(req.body);

        // Extract email and password from the login form
        const email = req.body.email;
        const password = req.body.password;

        // Find user by email in MongoDB
        const userData = await User.findOne({ email: email });
        console.log("User found:", userData);

        // If user exists
        if (userData) {
            // Compare entered password with the hashed password in database
            const passwordMatch = await bcrypt.compare(password, userData.password);

            // If password matches
            if (passwordMatch) {
                // Check if user has verified their email
                if (userData.is_verified === 0) {
                    // If not verified, show a message asking them to verify
                    res.render("users/login", { message: "Please verify your email." });
                } else {
                    //    req.session.user_id = userData._id;
                       

                    const token = createToken(userData);
                    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    // Redirect to home page after successful login
                    res.redirect("/home");
                }
            } else {
                // ❌ If password doesn’t match
                res.render("users/login", { message: "Your email and password do not match." });
            }
        } else {
            // ❌ If email doesn’t exist in database
            res.render("users/login", { message: "Your email and password are incorrect." });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.log("Error from verifyLogin:", error.message);
    }
};

const loadHome = async (req, res) => {
    try {
    

        // ✅ The user info is stored in the decoded JWT (from auth middleware)
        const userId = req.user.userId; // comes from createToken payload

        const userData = await User.findById(userId);

        if (!userData) {
            return res.redirect("/users/login");
        }

        res.render("users/home", { user: userData });
    } catch (error) {
        console.log("Error loading home:", error.message);
        res.redirect("/users/login");
    }
};


// const userLogout = async (req, res) => {
//   try {
//     // ✅ Remove JWT cookie
//     res.clearCookie("jwt");

//     // ✅ Redirect directly to login page
//     return res.redirect("/users/login");
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Something went wrong");
//   }
// };

const userLogout = async (req, res) => {
  try {
    console.log("🟢 Logout route called");

    // ✅ Clear the JWT cookie
    res.clearCookie("jwt");

    console.log("🟢 JWT cookie cleared");

    // ✅ Redirect to login
    return res.redirect("/login");
  } catch (error) {
    console.log("❌ Logout error:", error.message);
    res.status(500).send("Something went wrong during logout");
  }
};





//while using session 

// const logout = async (req, res) => {
//     try {
//         req.session.destroy();
//         res.redirect("users/login");
//     } catch (error) {
//         console.log("logout Error:", error.message);
//     }
// };



// forget password code start

const forgetLoad = async (req, res) => {
    try {
        res.render("users/forget");
    } catch (error) {
        console.log(error.message);
    }
};

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        console.log("Email from form:", req.body.email);

        const userData = await User.findOne({ email: email });

        if (userData) {
            if (userData.is_verified === 0) {
                res.render("users/forget", { message: "Please verify your email first." });
            } else {
                const randomString = randomsString.generate();

                // Update token in DB
                await User.updateOne({ email: email }, { $set: { token: randomString } });

                // ✅ Use existing userData for email and name
                sendResetPasswordMail(userData.name, userData.email, randomString);

                res.render("users/forget", {
                    message: "Please check your email to reset your password.",
                });
            }
        } else {
            res.render("users/forget", { message: "User email is incorrect." });
        }
    } catch (error) {
        console.log("Error in forgetVerify:", error.message);
    }
};

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });
        if (tokenData) {
            res.render("users/forget-password", { user_id: tokenData._id });
        } else {
            res.render("users/404", { message: "invaild token" });
        }
    } catch (error) {
        console.log("err from forgetPasswordLoad:", error);
    }
};

const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const secure_password = await securePassword(password);
     await User.findByIdAndUpdate(
            { _id: user_id },
            { $set: { password: secure_password, token: "" } }
        );

        res.redirect("/");
    } catch (error) {
        console.log("err from resetpassword:", error);
    }
};

const verificationLoad = async (req, res) => {
    try {
        res.render("users/verification");
    } catch (error) {
        console.log("er from verifyload:", error.message);
    }
};

const sendVerificationLink = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            sendVerifyMail(userData.name, userData.email, userData._id);
            res.render("users/verification", {
                message: "The link to verify email has been sent to your email Id, please verify it .",
            });
        } else {
            res.render("users/verification", { message: "This email doesn't exist." });
        }
    } catch (error) {
        console.log("er from verificationLink :", error.message);
    }
};

const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById(id);
        if (userData) {
            res.render("users/edit", { user: userData });
        } else {
            res.redirect("users/home");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await User.findByIdAndUpdate(req.body.user_id, { $set: updateData });

        res.redirect("/home");
    } catch (error) {
        console.log("Error from updateProfile:", error.message);
    }
};

module.exports = {
    verifyMail,
    loginLoad,
    loadRegister,
    insertUser,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    sendResetPasswordMail,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sendVerificationLink,
    editLoad,
    updateProfile,
};
