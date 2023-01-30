const router = require("express").Router();
const Activity = require("../models").activityModel;
const createActivityValidation =
  require("../validation/activity").createActivityValidation;

// GET api/activity/explore
router.get("/explore", async (req, res) => {
  Activity.find({})
    .then((activity) => {
      res.status(200).send(activity);
    })
    .catch(() => {
      res.status(500).send("Error!! Cannot get course!!");
    });
});

// POST api/activity/create
router.post("/create", async (req, res) => {
  let { formData } = req.body;

  try {
    // 驗證表單參數
    if (!formData) return res.status(400).send("未接收到表單資料！");

    const { error } = createActivityValidation(formData);

    if (error) return res.status(400).send(error.details[0].message);
  } catch (err) {
    res.status(500).send("伺服器錯誤，新活動建立失敗！");
  }

  try {
    let newActivity = new Activity(formData);
    await newActivity.save();
    res.status(200).send("新活動建立成功！");
  } catch (err) {
    res.status(500).send("伺服器錯誤，新活動建立失敗！");
  }
});

// POST api/activity/enroll/:activity_id
router.post("/enroll/:activity_id", async (req, res) => {
  let { activity_id } = req.params;
  let { user_id } = req.body;
  try {
    let activity = await Activity.findOne({ _id: activity_id });
    if (activity.enrollment.includes(user_id)) {
      return res.status(400).send("You have already signed up for this event!");
    }
    activity.enrollment.push(user_id);
    await activity.save();
    res.status(200).send("Done Enrollment.");
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST api/activity/enroll/:_id
router.post("/watch/:activity_id", async (req, res) => {
  let { activity_id } = req.params;
  try {
    let activity = await Activity.findOne({ _id: activity_id });
    activity.watch += 1;
    await activity.save();
    res.status(200).send("watch added!");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
