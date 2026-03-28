const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    teamA: String,
    teamB: String,
    probability: {
      type: Object,
    },
    trustScore: Number,
    stats: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = { Prediction };