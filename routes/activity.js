const router = require("express").Router();
const Activity = require("../models").activityModel;
const User = require("../models").userModel;
const createActivityValidation =
  require("../validation/activity").createActivityValidation;

// GET api/activity/explore
router.get("/explore", async (req, res) => {
  Activity.find({})
    .populate("creator", ["_id", "username"])
    .then((activity) => {
      res.status(200).send(activity);
    })
    .catch((err) => {
      res.status(500).send({
        message: "伺服器內部錯誤!",
        state: "error",
        error: err.message,
      });
    });
});

// POST api/activity/create
router.post("/create", async (req, res) => {
  try {
    let { formData, user_id } = req.body;

    // 驗證表單參數
    if (!formData)
      return res.status(400).send({
        message: "未接收到表單資料！",
        state: "error",
        error: "未接收到表單資料！",
      });

    let activityData = {
      ...formData,
      ...{ creator: user_id },
    };
    const { error } = createActivityValidation(activityData);
    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
        state: "warning",
        error: error,
      });
    }

    // 驗證標題重複
    let activity = await Activity.findOne({ title: activityData.title });
    if (activity) {
      return res.status(400).send({
        message: "此活動標題已被使用!",
        state: "warning",
        error: "此活動標題已被使用!",
      });
    }

    let newActivity = new Activity(activityData);
    await newActivity.save();
    res.status(200).send("新活動建立成功！");
  } catch (err) {
    res.status(500).send({
      message: "伺服器錯誤，新活動建立失敗!",
      state: "error",
      error: err,
    });
  }
});

// POST api/activity/enroll/:activity_id
router.post("/enroll/:activity_id", async (req, res) => {
  try {
    let { activity_id } = req.params;
    let { user_id } = req.body;
    let activity = await Activity.findOne({ _id: activity_id });
    let user = await User.findOne({ _id: user_id });

    if (activity.enrollment.includes(user_id)) {
      return res.status(400).send({
        message: "你已經報名過此活動!",
        state: "warning",
        error: "你已經報名過此活動!",
      });
    }
    activity.enrollment.push(user_id);
    user.enrolledActivity.push(activity_id);
    await activity.save();
    await user.save();
    res.status(200).send("Done Enrollment.");
  } catch (err) {
    res.status(500).send({
      message: "伺服器錯誤，參加建立失敗!",
      state: "error",
      error: err.message,
    });
  }
});

// POST api/activity/enroll/:_id
router.post("/watch/:activity_id", async (req, res) => {
  try {
    let { activity_id } = req.params;

    let activity = await Activity.findOne({ _id: activity_id });
    activity.watch += 1;
    await activity.save();
    res.status(200).send("watch added!");
  } catch (err) {
    res.status(500).send({
      message: "伺服器錯誤，參加建立失敗!",
      state: "error",
      error: err.message,
    });
  }
});

module.exports = router;
