const { allCsvSpellingsForFranchise } = require("./teamFranchise");
const { strikerName, bowlerName } = require("./deliveryNormalize");

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

function isValidBallName(name) {
  if (name == null || name === "NA") return false;
  const s = String(name).trim();
  return s.length > 0 && s.toLowerCase() !== "undefined";
}

function collectTopPlayers(deliveries, aliasSet, role, seasonIds) {
  const counts = {};
  for (const d of deliveries) {
    if (seasonIds) {
      const mid = Number(d.match_id);
      if (!seasonIds.has(mid)) continue;
    }
    if (role === "batter") {
      const bt = d.batting_team;
      if (!aliasSet.has(bt)) continue;
      const batter = strikerName(d);
      if (!isValidBallName(batter)) continue;
      const key = batter;
      counts[key] = (counts[key] || 0) + 1;
    } else {
      const bwt = d.bowling_team;
      if (!aliasSet.has(bwt)) continue;
      const bowler = bowlerName(d);
      if (!isValidBallName(bowler)) continue;
      const key = bowler;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return countMapTopN(counts, PLAYING_XI_SIZE);
}

/**
 * @param {'batter'|'bowler'} role
 */
function getTeamSquadForSeason(deliveries, teamName, role) {
  if (!deliveries?.length || !teamName) {
    return {
      players: [],
      season: {
        label: "Current window (latest matches)",
        matchCount: 0,
        totalMatchesInDataset: 0,
        usedFallback: false,
      },
    };
  }

  const aliasSet = allCsvSpellingsForFranchise(teamName, deliveries);
  const { ids: seasonIds, totalMatches, seasonMatchCount } =
    getCurrentSeasonMatchIdSet(deliveries);

  let players = collectTopPlayers(deliveries, aliasSet, role, seasonIds);
  let usedFallback = false;
  let label = "Current season (latest match window)";

  if (players.length === 0) {
    players = collectTopPlayers(deliveries, aliasSet, role, null);
    usedFallback = true;
    label = "Full dataset (recent window had no rows for this team)";
  }

  return {
    players,
    season: {
      label,
      matchCount: usedFallback ? totalMatches : seasonMatchCount,
      totalMatchesInDataset: totalMatches,
      usedFallback,
    },
  };
}

module.exports = {
  getTeamSquadForSeason,
  PLAYING_XI_SIZE,
};
