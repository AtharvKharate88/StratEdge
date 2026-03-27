const { Behavior } = require("../models/Behavior");
const asyncHandler = require("../middleware/asyncHandler");

const trackBehavior = asyncHandler(async (req, res) => {
  const { predictionId, timeSpent, clicks } = req.body;

  // Simple behavior classification
  let behaviorType = "neutral";
  // If the user is clicking a lot and spending time, they may be struggling.
  if (timeSpent >= 20 && clicks >= 5) {
    behaviorType = "confused";
  } else if (timeSpent > 60 && clicks < 5) {
    behaviorType = "confident";
  }

  const behavior = await Behavior.create({
    prediction: predictionId,
    timeSpent,
    clicks,
    behaviorType,
  });

  res.status(201).json({
    success: true,
    data: behavior,
  });
});

module.exports = { trackBehavior };