const { Prediction } = require("../models/Prediction");
const asyncHandler = require("../middleware/asyncHandler");

const getHistory = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: predictions.length,
    data: predictions,
  });
});

module.exports = { getHistory };