const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Sesuaikan dengan nama model User Anda
  },
  type: {
    type: String,
    enum: ["login", "logout"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
