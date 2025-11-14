require("dotenv").config();
const connect = require("./config/dbConfig");

connect();

const express = require("express");
const app = express();
const path = require("path");


app.set("view engine", "ejs");
app.set("views", "./views");


app.use(express.json());
app.use(express.urlencoded({extended:true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next)=>{
res.setHeader("Cache-Control","no-store");
next();
});


// your  user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);


// your  admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

//to catch errors from all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


const port = process.env.PORT || 3000;
app.listen(port, console.log("The Server started running..."));
