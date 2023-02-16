var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const zlib = require("zlib");

const userModel = require("./models").userModel;

require("dotenv").config();

const passport = require("passport");
require("./config/passport")(passport);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// routes 除了auth以外, 都需要經過jwt認證
const routes = require("./routes");
app.use("/api/auth", routes.auth);

app.use(
  "/api/auth_session",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).send("授權成功！");
  }
);

app.use(
  "/api/activity",
  passport.authenticate("jwt", { session: false }),
  routes.activity
);

app.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  routes.user
);

app.use(
  "/api/group",
  passport.authenticate("jwt", { session: false }),
  routes.group
);

// 測試用
app.get("/trial", function (req, res) {
  res.send("hello world");
});

// const upload = multer({ dest: "uploads/" });

// app.post("/server/upload", upload.single("file"), (req, res) => {
//   /* 直接儲存 */
//   res.json({ file: req.file });

//   /* 改名 */
//   // let newPath = `uploads/${req.file.originalname}`;
//   // fs.rename(req.file.path, newPath, () => {
//   //   res.json({ result: "image uploaded successful" });
//   // });

//   // const file = req.file;
//   // const fileContents = file.buffer;

//   // zlib.gzip(fileContents, (err, result) => {
//   //   if (err) {
//   //     return res.status(500).send(err);
//   //   }
//   //   res.json({ result: result });
//   // });

// });

// mongoose資料庫
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then((_) => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  console.log("receive request: " + req.path);
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
