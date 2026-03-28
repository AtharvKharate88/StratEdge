const { Prediction } = require("../models/Prediction");
const asyncHandler = require("../middleware/asyncHandler");

const getHistory = asyncHandler(async (req, res) => {
  // Check authentication
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Fetch predictions for the logged-in user
  const predictions = await Prediction.find({ userId: req.userId });

  // Send response
  res.status(200).json({
    success: true,
    count: predictions.length,
    data: predictions,
  });
});

module.exports = { getHistory };