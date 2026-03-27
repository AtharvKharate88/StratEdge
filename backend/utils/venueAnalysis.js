const calculateVenueStats = (deliveries, matches) => {
  const matchVenueMap = {};

  // map match_id → venue
  matches.forEach((match) => {
    const matchId = match.id || match.match_id;
    const venue = match.venue;
    if (matchId && venue) {
      matchVenueMap[matchId] = venue;
    }
  });

  const venueStats = {};

  deliveries.forEach((ball) => {
    // Prefer venue present in deliveries row; fallback to match_id mapping.
    const venue = ball.venue || matchVenueMap[ball.match_id];

    if (!venue) return;

    if (!venueStats[venue]) {
      venueStats[venue] = {
        totalRuns: 0,
        matches: new Set(),
      };
    }

    venueStats[venue].totalRuns += Number(ball.total_runs || 0);
    venueStats[venue].matches.add(ball.match_id);
  });

  const result = {};

  Object.keys(venueStats).forEach((venue) => {
    const data = venueStats[venue];
    const matchCount = data.matches.size;

    const avgRuns = matchCount
      ? data.totalRuns / matchCount
      : 0;

    let type = "Balanced";

    if (avgRuns > 170) type = "Batting Friendly";
    else if (avgRuns < 140) type = "Bowling Friendly";

    result[venue] = {
      avgRuns: Number(avgRuns.toFixed(2)),
      matches: matchCount,
      type,
    };
  });

  return result;
};

module.exports = calculateVenueStats;