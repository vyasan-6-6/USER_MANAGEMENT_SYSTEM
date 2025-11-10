require("dotenv").config();
const connect = require("./config/dbConfig");

connect();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// const session = require("express-session");
// const sessionSet = {
//    secret:"hi",
//    resave:false,
//    saveUninitialized: false,
//    cookies:{
//     httpOnly:true,
//     maxAge: 1000*60*60*24
//    }
// };
// app.use(session(sessionSet));


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

//to catch errors from all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// your  admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

const port = process.env.PORT || 3000;
app.listen(port, console.log("The Server started running..."));
