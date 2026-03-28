const { strikerName, bowlerName } = require("./deliveryNormalize");

const getPlayerBattleStats = (batter, bowler, deliveries) => {
  let runs = 0;
  let balls = 0;
  let dismissals = 0;

  deliveries.forEach((ball) => {
    if (strikerName(ball) === batter && bowlerName(ball) === bowler) {
      balls++;

      runs += Number(ball.batsman_runs || 0);

      const out = String(ball.player_dismissed || "").trim();
      if (out && out === batter) {
        dismissals++;
      }
    }
  });

  const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;

  let dominanceTag = "Balanced";
  if (strikeRate > 140) {
    dominanceTag = "Batter Dominates";
  }
  if (dismissals > 2) {
    dominanceTag = "Bowler Dominates";
  }

  const dataStatus = balls < 10 ? "Not enough data" : "Sufficient data";

  return {
    batter,
    bowler,
    runs,
    balls,
    dismissals,
    strikeRate: strikeRate.toFixed(2),
    dataStatus,
    dominanceTag,
  };
};

module.exports = { getPlayerBattleStats };