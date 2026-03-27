const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
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