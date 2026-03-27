const getPlayerBattleStats = (batter, bowler, deliveries) => {
  let runs = 0;
  let balls = 0;
  let dismissals = 0;

  deliveries.forEach((ball) => {
    if (
      ball.batter === batter &&
      ball.bowler === bowler
    ) {
      balls++;

      runs += Number(ball.batsman_runs || 0);

      // dismissal check
      if (
        ball.player_dismissed === batter &&
        ball.is_wicket === "1"
      ) {
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