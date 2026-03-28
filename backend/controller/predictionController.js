const { predictMatch } = require("../utils/predictor");
const {
  getTeamStats,
  getVenueData,
  getPlayerImpactData,
  getDeliveriesData,
} = require("../utils/globalStore");
const { Prediction } = require("../models/Prediction");
const asyncHandler = require("../middleware/asyncHandler");
const { getPlayerBattleStats } = require("../utils/playerBattle");

const predict = asyncHandler(async (req, res) => {
  const { teamA, teamB, venue, batter, bowler } = req.body;
  const teamStats = getTeamStats();

  const result = predictMatch(teamA, teamB, teamStats);
  const allVenueData = getVenueData();
  let venueInsight = null;
  if (venue) {
    const venueKey = Object.keys(allVenueData).find(
      (v) => v.trim().toLowerCase() === String(venue).trim().toLowerCase()
    );
    venueInsight = venueKey ? allVenueData[venueKey] : null;
  }
  const topPlayers = getPlayerImpactData()
    .filter((row) => row && row.player)
    .slice(0, 5);
  const playerBattle =
    batter && bowler
      ? getPlayerBattleStats(batter, bowler, getDeliveriesData())
      : null;

  const trustNum = Number(result.trustScore);
  const prediction = await Prediction.create({
    userId: req.userId,
    teamA,
    teamB,
    probability: result.probability,
    trustScore: Number.isFinite(trustNum) ? trustNum : 0,
    stats: result.stats,
  });

  res.status(201).json({
    success: true,
    data: {
      ...result,
      topPlayers,
      playerBattle,
      venueInsight,
    },
    predictionId: prediction._id,
  });
});

module.exports = { predict };