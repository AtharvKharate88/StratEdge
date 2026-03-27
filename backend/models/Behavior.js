const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema(
  {
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: true,
    },
    timeSpent: Number,
    clicks: Number,
    behaviorType: {
      type: String,
      enum: ["confused", "neutral", "confident"],
    },
  },
  { timestamps: true }
);

const Behavior = mongoose.model("Behavior", behaviorSchema);

module.exports = { Behavior };