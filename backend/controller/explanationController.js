const { generateExplanation } = require("../utils/aiClient");
const asyncHandler = require("../middleware/asyncHandler");
const logger = require("../utils/logger");

const explainPrediction = asyncHandler(async (req, res) => {
  const explanation = await generateExplanation(req.body);

  logger.info("Explanation generated", {
    teamA: req.body?.teamA,
    teamB: req.body?.teamB,
  });

  res.status(200).json({
    success: true,
    explanation,
  });
});

module.exports = { explainPrediction };