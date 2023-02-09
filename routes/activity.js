const router = require("express").Router();
const Activity = require("../models").activityModel;
const User = require("../models").userModel;
const createActivityValidation =
  require("../validation/activity").createActivityValidation;

function checkDataValidation(formData) {
  // 檢查資料格式, 空白, 重複, 可動
}

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

// POST api/activity/cancel/:activity_id
router.post("/cancel/:activity_id", async (req, res) => {
  try {
    let { activity_id } = req.params;
    let { user_id } = req.body;
    let activity = await Activity.findOne({ _id: activity_id });
    let user = await User.findOne({ _id: user_id });

    let userid_index = -1;
    let activityid_index = -1;

    for (let i in activity.enrollment)
      if (activity.enrollment[i] == user_id) userid_index = i;

    for (let i in user.enrolledActivity)
      if (user.enrolledActivity[i] == activity_id) activityid_index = i;

    if (userid_index === -1 && activityid_index === -1) {
      return res.status(400).send({
        message: "你不再此活動中!",
        state: "error",
        error: "你不再此活動中!",
      });
    }

    if (userid_index != -1) activity.enrollment.splice(userid_index, 1);
    if (activityid_index != -1)
      user.enrolledActivity.splice(activityid_index, 1);

    await activity.save();
    await user.save();
    res.status(200).send("取消成功!");
  } catch (err) {
    res.status(500).send({
      message: "伺服器錯誤，取消失敗!",
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
      message: "伺服器錯誤，增加觀看失敗!",
      state: "error",
      error: err.message,
    });
  }
});

// PATCH api/activity/edit/:_id
router.patch("/edit/:activity_id", async (req, res) => {
  try {
    let { activity_id } = req.params;
    let { formData } = req.body;

    let activity = await Activity.findOne({ _id: activity_id });

    for (let key in formData) {
      if (formData[key] !== undefined && activity[key] !== undefined) {
        activity[key] = formData[key];
      }
    }

    await activity.save();
    res.status(200).send("edit done!");
  } catch (err) {
    res.status(500).send({
      message: "伺服器錯誤，修改活動失敗!",
      state: "error",
      error: err.message,
    });
  }
});

module.exports = router;
