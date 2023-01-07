const router = require("express").Router();

// POST api/explore
router.post("/", (req, res) => {
  console.log("A request is coming into api/...");
  res.send("work success");
});

module.exports = router;
