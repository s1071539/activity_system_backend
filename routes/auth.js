const OAuth2Client = require("google-auth-library").OAuth2Client;
const router = require("express").Router();
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

// GET api/auth/testAPI
router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  return res.status(200).json(msgObj);
});

router.post("/upload", (req, res) => {
  const msgObj = {
    name: "xxx.png",
    status: "done",
    url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    thumbUrl:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  };
  return res.status(200).json(msgObj);
});

// POST api/auth/signup
router.post("/signup", async (req, res) => {
  const reqData = req.body.formData;
  const emailExist = await User.findOne({ email: reqData.email });
  if (emailExist)
    return res.status(400).send("Email has already been registered.");

  const newUser = new User({
    email: reqData.email,
    password: reqData.password,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "註冊成功！",
      savedObject: savedUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// POST api/auth/login
router.post("/login", (req, res) => {
  const reqData = req.body.formData;
  User.findOne({ email: reqData.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("User not found.");
    } else {
      user.comparePassword(reqData.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ msg: "登入成功！", token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong password.");
        }
      });
    }
  });
});

// POST api/auth/googleAuth
router.post("/googleAuth", async (req, res) => {
  const accessToken = req.body.accessToken;

  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const payload = await oauth2Client
    .request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    })
    .then((response) => response.data)
    .catch(() => null);

  oauth2Client.revokeCredentials();

  // sub: The subject of the token.An identifier for the user, unique among all Google accounts and never reused.
  let userInfo = {
    id: payload.sub,
    name: payload.name,
    avatar: payload.picture,
    email: payload.email,
  };

  // 判斷此ID是否存在
  let googleUser = await User.findOne({ email: userInfo.email });

  // 若不存在, 獲取email後, 用id當密碼, 創建新帳號
  if (!googleUser) {
    const newUser = new User({
      email: userInfo.email,
      password: userInfo.id,
    });
    try {
      googleUser = await newUser.save();
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  const tokenObject = { _id: googleUser._id, email: googleUser.email };
  const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
  res
    .status(200)
    .send({ msg: "登入成功！", token: "JWT " + token, googleUser });
});

module.exports = router;
