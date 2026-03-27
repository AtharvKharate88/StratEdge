const asyncHandler = require("../middleware/asyncHandler");
const { Prediction } = require("../models/Prediction");
const { getPlayerImpactData } = require("../utils/globalStore");

/**
 * Aggregate lightweight dashboard KPIs from DB + in-memory player list.
 */
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const playersAnalyzed = getPlayerImpactData().length;

  let predictionsToday = 0;
  let avgTrustPercent = 72;
  let sampleCount = 0;

  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    predictionsToday = await Prediction.countDocuments({
      createdAt: { $gte: start },
    });

    const recent = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("trustScore")
      .lean();

    let sum = 0;
    for (const p of recent) {
      const raw = Number(p.trustScore);
      if (!Number.isFinite(raw)) continue;
      const pct = raw > 1 ? raw : raw * 100;
      sum += pct;
      sampleCount++;
    }
    if (sampleCount > 0) {
      avgTrustPercent = Math.round((sum / sampleCount) * 10) / 10;
    }
  } catch {
    // Mongo unavailable or empty — keep defaults
  }

  res.status(200).json({
    success: true,
    data: {
      predictionsToday,
      accuracyRate: null,
      avgTrustScore: avgTrustPercent,
      playersAnalyzed,
    },
  });
});

module.exports = { getDashboardMetrics };
