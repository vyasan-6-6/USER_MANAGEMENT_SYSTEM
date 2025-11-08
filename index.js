require("dotenv").config();
const connect = require("./config/dbConfig");

connect();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const session = require("express-session");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// your  user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

// your  admin routes
const adminRoute = require("./routes/adminRoute");
const dbConnect = require("./config/dbConfig");
app.use("/admin", adminRoute);

const port = process.env.PORT || 3000;
app.listen(port, console.log("The Server started running..."));
