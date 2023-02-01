const router = require("express").Router();
const Group = require("../models").groupModel;
const createGroupValidation =
  require("../validation/group").createGroupValidation;

// GET api/group
router.get("/", (req, res) => {
  Group.find({})
    .then((group) => {
      res.status(200).send(group);
    })
    .catch((err) => {
      res.status(500).send({
        message: "伺服器錯誤，獲取群組失敗!",
        state: "error",
        error: err.message,
      });
    });
});

// POST api/group/create
router.post("/create", (req, res) => {
  let { formData } = req.body;

  try {
    // 驗證表單參數
    if (!formData)
      return res.status(400).send({
        message: "未接收到表單資料！",
        state: "error",
        error: "未接收到表單資料！",
      });

    const { error } = createGroupValidation(formData);

    if (error)
      return res.status(400).send({
        message: error.details[0].message,
        state: "warning",
        error: error,
      });

    let newGroup = new Group(formData);
    Group.findOne({ name: formData.name }).then(async (activity) => {
      if (activity) {
        return res.status(400).send({
          message: "此群組名稱已被使用!",
          state: "warning",
          error: "此群組名稱已被使用!",
        });
      }
      await newGroup.save();
      res.status(200).send("新群組建立成功！");
    });
  } catch (err) {
    res.status(500).send({
      message: "伺服器錯誤，新群組建立失敗!",
      state: "error",
      error: err,
    });
  }
});

module.exports = router;
