const { csvTeamAliasesForSelection } = require("./teamFranchise");

const PLAYING_XI_SIZE = 11;

function getCurrentSeasonMatchIdSet(deliveries) {
  const uniqueMatchIds = [
    ...new Set(
      deliveries.map((d) => Number(d.match_id)).filter((n) => Number.isFinite(n))
    ),
  ].sort((a, b) => a - b);
  const bucketSize = Math.max(1, Math.floor(uniqueMatchIds.length * 0.2));
  return {
    ids: new Set(uniqueMatchIds.slice(-bucketSize)),
    totalMatches: uniqueMatchIds.length,
    seasonMatchCount: Math.min(bucketSize, uniqueMatchIds.length),
  };
}

function countMapTopN(map, n) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name]) => name);
}

/**
 * Current "season" window uses the same recency bucket as player impact (latest ~20% of matches).
 * @param {'batter'|'bowler'} role
 */
function getTeamSquadForSeason(deliveries, teamName, role) {
  if (!deliveries?.length || !teamName) {
    return {
      players: [],
      season: {
        label: "Current window (latest matches)",
        matchCount: 0,
      },
    };
  }

  const { ids: seasonIds, totalMatches, seasonMatchCount } =
    getCurrentSeasonMatchIdSet(deliveries);
  const aliases = csvTeamAliasesForSelection(teamName);
  const aliasSet = new Set(aliases);

  const counts = {};

  for (const d of deliveries) {
    const mid = Number(d.match_id);
    if (!seasonIds.has(mid)) continue;

    if (role === "batter") {
      const bt = d.batting_team;
      if (!aliasSet.has(bt)) continue;
      const batter = d.batter;
      if (!batter || batter === "NA") continue;
      counts[batter] = (counts[batter] || 0) + 1;
    } else {
      const bwt = d.bowling_team;
      if (!aliasSet.has(bwt)) continue;
      const bowler = d.bowler;
      if (!bowler || bowler === "NA") continue;
      counts[bowler] = (counts[bowler] || 0) + 1;
    }
  }

  const players = countMapTopN(counts, PLAYING_XI_SIZE);

  return {
    players,
    season: {
      label: "Current season (latest match window)",
      matchCount: seasonMatchCount,
      totalMatchesInDataset: totalMatches,
    },
  };
}

module.exports = {
  getTeamSquadForSeason,
  PLAYING_XI_SIZE,
}
