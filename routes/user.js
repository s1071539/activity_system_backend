const router = require("express").Router();
const User = require("../models").userModel;

// GET api/user/:user_id
router.get("/:user_id", (req, res) => {
  try {
    let { user_id } = req.params;

    return User.findOne({ _id: user_id })
      .populate("likedActivity", ["_id", "title"])
      .populate("enrolledActivity", ["_id", "title"])
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    res.status(500).send({
      message: "伺服器內部錯誤!",
      state: "error",
      error: err,
    });
  }
});

// POST api/user/likeActivity/:activity_id
router.post("/likeActivity/:activity_id", async (req, res) => {
  try {
    let { activity_id } = req.params;
    let { user_id } = req.body;

    let user = await User.findOne({ _id: user_id });
    const activityIndex = user.likedActivity.indexOf(activity_id);
    if (activityIndex === -1) user.likedActivity.push(activity_id);
    else user.likedActivity.splice(activityIndex, 1);
    await user.save();
    res.status(200).send("like Enrollment.");
  } catch (err) {
    res.status(500).send({
      message: "伺服器內部錯誤!",
      state: "error",
      error: err,
    });
  }
});
// PUT api/user/updateProfile
router.put("/updateProfile/", async (req, res) => {
  try {
    let { type, value } = req.body;
    let user_id = req.user._id;
    const filter = { _id: user_id };
    const update = {};
    update[type] = value;
    await User.findOneAndUpdate(filter, update);
    res.status(200).send(type + "修改成功!");
  } catch (err) {
    res.status(500).send({
      message: "伺服器內部錯誤!",
      state: "error",
      error: err,
    });
  }
});
module.exports = router;
