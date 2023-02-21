const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  object: {
    type: [String],
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
    type: String,
    require: true,
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
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  watch: {
    type: Number,
    default: 0,
  },
  enrollment: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Activity", activitySchema);
