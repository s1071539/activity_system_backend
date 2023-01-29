const router = require("express").Router();
const Activity = require("../models").activityModel;
const createActivityValidation =
  require("../validation/activity").createActivityValidation;

// POST api/activity/create
router.post("/create", async (req, res) => {
  let { formData } = req.body;

  try {
    // 驗證表單參數
    if (!formData) return res.status(400).send("未接收到表單資料！");

    const { error } = createActivityValidation(formData);

    if (error) return res.status(400).send(error.details[0].message);
  } catch (err) {
    res.status(400).send("伺服器錯誤，新活動建立失敗！");
  }

  try {
    // let newActivity = new Activity(formData);
    // await newActivity.save();
    res.status(200).send("新活動建立成功！");
  } catch (err) {
    res.status(400).send("伺服器錯誤，新活動建立失敗！");
  }
});

module.exports = router;
