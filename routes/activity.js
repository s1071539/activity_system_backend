const router = require("express").Router();
const Activity = require("../models").activityModel;

// POST api/activity/create
router.post("/create", async (req, res) => {
  // validate the inputs before making a new activity
  //   const { error } = courseValidation(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);

  let { formData } = req.body;

  try {
    let newActivity = new Activity(formData);
    await newActivity.save();
    res.status(200).send("新活動建立成功！");
  } catch (err) {
    res.status(400).send("伺服器錯誤，新活動建立失敗！");
  }
});

module.exports = router;
