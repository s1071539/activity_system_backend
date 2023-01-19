const router = require("express").Router();

// POST api/activity/create
router.post("/create", async (req, res) => {
  // validate the inputs before making a new activity
  //   const { error } = courseValidation(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);
  let newActivity = new Activity(req.body);

  try {
    await newActivity.save();
    res.status(200).send("New activity has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save activity.");
  }
});

module.exports = router;
