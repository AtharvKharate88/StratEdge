const calculatePlayerImpact = (deliveries) => {
    const playerStats = {};

    // Dataset has no explicit year/date column, so we use match_id recency as a proxy.
    const uniqueMatchIds = [...new Set(deliveries.map((d) => Number(d.match_id)).filter((n) => Number.isFinite(n)))]
      .sort((a, b) => a - b);

    const bucketSize = Math.max(1, Math.floor(uniqueMatchIds.length * 0.2));
    const thisYearIds = new Set(uniqueMatchIds.slice(-bucketSize));
    const lastYearIds = new Set(uniqueMatchIds.slice(-2 * bucketSize, -bucketSize));
  
    deliveries.forEach((ball) => {
      const player = ball.batter;
  
      if (!playerStats[player]) {
        playerStats[player] = {
          runs: 0,
          balls: 0,
          matches: new Set(),
          recentRunsThisYear: 0,
          recentBallsThisYear: 0,
          recentRunsLastYear: 0,
          recentBallsLastYear: 0,
        };
      }
  
      playerStats[player].runs += Number(ball.batsman_runs || 0);
      playerStats[player].balls += 1;
  
      // track matches
      playerStats[player].matches.add(ball.match_id);

      const matchIdNum = Number(ball.match_id);
      if (thisYearIds.has(matchIdNum)) {
        playerStats[player].recentRunsThisYear += Number(ball.batsman_runs || 0);
        playerStats[player].recentBallsThisYear += 1;
      } else if (lastYearIds.has(matchIdNum)) {
        playerStats[player].recentRunsLastYear += Number(ball.batsman_runs || 0);
        playerStats[player].recentBallsLastYear += 1;
      }
    });
  
    const impactArray = [];
  
    Object.keys(playerStats).forEach((player) => {
      const data = playerStats[player];
  
      const matches = data.matches.size;
      const avgRuns = matches ? data.runs / matches : 0;
      const strikeRate = data.balls
        ? (data.runs / data.balls) * 100
        : 0;

      const thisYearStrikeRate = data.recentBallsThisYear
        ? (data.recentRunsThisYear / data.recentBallsThisYear) * 100
        : 0;
      const lastYearStrikeRate = data.recentBallsLastYear
        ? (data.recentRunsLastYear / data.recentBallsLastYear) * 100
        : 0;

      // More weight to current form, then previous form window.
      const formFactor = thisYearStrikeRate * 0.6 + lastYearStrikeRate * 0.4;
  
      const consistency = matches;
  
      const impactScore =
        avgRuns * 0.4 +
        strikeRate * 0.25 +
        consistency * 0.15 +
        formFactor * 0.2;
  
      impactArray.push({
        player,
        impactScore: Number(impactScore.toFixed(2)),
        avgRuns: Number(avgRuns.toFixed(2)),
        strikeRate: Number(strikeRate.toFixed(2)),
        thisYearForm: Number(thisYearStrikeRate.toFixed(2)),
        lastYearForm: Number(lastYearStrikeRate.toFixed(2)),
        formFactor: Number(formFactor.toFixed(2)),
        matches,
      });
    });
  
    // sort descending
    impactArray.sort((a, b) => b.impactScore - a.impactScore);
  
    return impactArray;
  };

module.exports = { calculatePlayerImpact };