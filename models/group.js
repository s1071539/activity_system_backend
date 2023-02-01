const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  member: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  authority: {
    type: [String],
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

module.exports = mongoose.model("Group", GroupSchema);
