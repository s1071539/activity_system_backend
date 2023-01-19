const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  object: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  activity_time: {
    type: [Date],
    required: true,
  },
  enroll_time: {
    type: [Date],
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  manager_contact: {
    type: String,
    required: true,
  },
  quota: {
    type: Number,
    required: true,
  },
  activity_imgs: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  id: String,
  like: Boolean,
  watch: Number,
  enrollment: Number,
});

module.exports = mongoose.model("Activity", activitySchema);
