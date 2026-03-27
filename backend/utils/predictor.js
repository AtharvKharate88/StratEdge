const { resolveTeamKeyInStats } = require("./teamFranchise");

const predictMatch = (teamA, teamB, stats) => {
  const keyA = resolveTeamKeyInStats(teamA, stats);
  const keyB = resolveTeamKeyInStats(teamB, stats);
  const a = keyA ? stats[keyA] : null;
  const b = keyB ? stats[keyB] : null;

  if (!a || !b) {
    const missing = [!keyA && teamA, !keyB && teamB].filter(Boolean).join(", ");
    throw new Error(
      missing
        ? `Team data not found for: ${missing}`
        : "Team data not found"
    );
  }

  const scoreA =
    a.winRate * 0.6 +
    (a.avgRuns / (a.avgRuns + b.avgRuns)) * 0.4;

  const scoreB =
    b.winRate * 0.6 +
    (b.avgRuns / (a.avgRuns + b.avgRuns)) * 0.4;

  const total = scoreA + scoreB;

  const probA = (scoreA / total) * 100;
  const probB = (scoreB / total) * 100;

  // Trust score (simple version)
  const diff = Math.abs(probA - probB);
  const trustScore = Math.min(100, diff + 50);

  return {
    teamA,
    teamB,
    probability: {
      [teamA]: probA.toFixed(2),
      [teamB]: probB.toFixed(2),
    },
    trustScore: trustScore.toFixed(2),
    stats: {
      [teamA]: { ...a },
      [teamB]: { ...b },
    },
  };
};

module.exports = { predictMatch };