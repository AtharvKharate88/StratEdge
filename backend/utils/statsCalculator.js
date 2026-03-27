const calculateStats = (ballData) => {
  const matchSummary = {};
  const teamStats = {};

  // Group by match_id to get match-level data
  ballData.forEach((ball) => {
    const matchId = ball.match_id;
    
    if (!matchSummary[matchId]) {
      matchSummary[matchId] = {
        batting_team_inning1: null,
        bowling_team_inning1: null,
        batting_team_inning2: null,
        bowling_team_inning2: null,
        runs_inning1: 0,
        runs_inning2: 0,
        inning: null,
      };
    }

    const inning = Number(ball.inning);
    const summary = matchSummary[matchId];

    if (inning === 1) {
      summary.batting_team_inning1 = ball.batting_team;
      summary.bowling_team_inning1 = ball.bowling_team;
      summary.runs_inning1 += Number(ball.total_runs || 0);
    } else if (inning === 2) {
      summary.batting_team_inning2 = ball.batting_team;
      summary.bowling_team_inning2 = ball.bowling_team;
      summary.runs_inning2 += Number(ball.total_runs || 0);
    }
  });

  // Calculate team stats
  Object.keys(matchSummary).forEach((matchId) => {
    const match = matchSummary[matchId];
    
    const team1 = match.batting_team_inning1;
    const team2 = match.bowling_team_inning1;
    
    if (!team1 || !team2) return;

    // Initialize teams if not exists
    if (!teamStats[team1]) {
      teamStats[team1] = { matches: 0, wins: 0, totalRuns: 0 };
    }
    if (!teamStats[team2]) {
      teamStats[team2] = { matches: 0, wins: 0, totalRuns: 0 };
    }

    // Matches played
    teamStats[team1].matches++;
    teamStats[team2].matches++;

    // Runs
    teamStats[team1].totalRuns += match.runs_inning1 || 0;
    teamStats[team2].totalRuns += match.runs_inning2 || 0;

    // Winner determination (team with higher runs)
    if (match.runs_inning1 > match.runs_inning2) {
      teamStats[team1].wins++;
    } else if (match.runs_inning2 > match.runs_inning1) {
      teamStats[team2].wins++;
    }
  });

  // Final calculations
  Object.keys(teamStats).forEach((team) => {
    const t = teamStats[team];
    t.winRate = t.matches > 0 ? Number((t.wins / t.matches).toFixed(3)) : 0;
    t.avgRuns = t.matches > 0 ? Number((t.totalRuns / t.matches).toFixed(2)) : 0;
  });

  return teamStats;
};

module.exports = { calculateStats };