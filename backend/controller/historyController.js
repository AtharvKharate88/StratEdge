const { Prediction } = require("../models/Prediction");
const asyncHandler = require("../middleware/asyncHandler");

const getHistory = asyncHandler(async (req, res) => {
<<<<<<< Updated upstream
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const predictions = await Prediction.find({ userId: req.userId })
=======
  const predictions = await Prediction.find({ user: req.userId })
>>>>>>> Stashed changes
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.status(200).json({
    success: true,
    count: predictions.length,
    data: predictions,
  });
});

module.exports = { getHistory };
