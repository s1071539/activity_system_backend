const router = require("express").Router();
const User = require("../models").userModel;

// GET api/user/:user_id
router.get("/:user_id", (req, res) => {
  let { user_id } = req.params;
  User.find({ _id: user_id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send("Error!! Cannot get user!!");
    });
});

// GET api/user/like/:activity_id
router.post("/like/:activity_id", async (req, res) => {
  let { activity_id } = req.params;
  let { user_id } = req.body;
  try {
    let user = await User.findOne({ _id: user_id });
    const activityIndex = user.likedActivity.indexOf(activity_id);
    if (activityIndex === -1) user.likedActivity.push(activity_id);
    else user.likedActivity.splice(activityIndex, 1);
    await user.save();
    res.status(200).send("like Enrollment.");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
