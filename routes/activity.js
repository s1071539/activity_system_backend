const router = require("express").Router();
const Activity = require("../models").activityModel;
const User = require("../models").userModel;
const createActivityValidation =
  require("../validation/activity").createActivityValidation;

const multer = require("multer");
const fs = require("fs");

function checkDataValidation(formData) {
  // 檢查資料格式, 空白, 重複, 可動
}

// GET api/activity/explore
router.get("/explore", async (req, res) => {
  Activity.find({})
    .populate("creator", ["_id", "username"])
    .then((activities) => {
      res.status(200).send(activities);
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
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });
router.post("/create", upload.array("files"), async (req, res) => {
  try {
    let formData = req.body;

    // parse原本stringify的formData
    for (let i in formData) {
      formData[i] = JSON.parse(formData[i]);
    }

    // 將建立者加到資料中
    let activityData = {
      ...formData,
      ...{ creator: req.user.id },
    };

    // 驗證資料合法性
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
        message: "此活動標題已被使用",
        state: "warning",
        error: "此活動標題已被使用",
      });
    }

    // 將上傳圖片轉成base64編碼
    // 參考https://ithelp.ithome.com.tw/articles/10231435
    activityData["activity_imgs"] = [];
    for (let file of req.files) {
      let encode_image = Buffer.from(file.buffer).toString("base64");
      activityData["activity_imgs"].push(encode_image);
    }

    // 儲存至mongoose
    let newActivity = new Activity(activityData);
    await newActivity.save();

    return res.status(200).send("新活動建立成功");
  } catch (err) {
    if (err.expected) {
      return res.status(500).send(err);
    } else {
      return res.status(500).send({
        message: "伺服器錯誤，新活動建立失敗!",
        state: "error",
        error: err,
      });
    }
  }
});

// POST api/activity/enroll/:activity_id
router.post("/enroll/:activity_id", async (req, res) => {
  try {
    let { activity_id } = req.params;
    let user_id = req.user._id;
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

router.post("/delete/:activity_id", async (req, res) => {
  let { activity_id } = req.params;
  Activity.findByIdAndRemove(activity_id, (err, example) => {
    if (err) {
      res.status(500).send({
        message: "伺服器錯誤，刪除活動失敗!",
        state: "error",
        error: err.message,
      });
    } else {
      res.status(200).send("delete done!");
    }
  });
});

module.exports = router;
