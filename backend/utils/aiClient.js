const { GoogleGenerativeAI } = require("@google/generative-ai");
const AppError = require("./AppError");

const generateExplanation = async (data) => {
  const {
    teamA,
    teamB,
    probability,
    trustScore,
    stats,
    topPlayers,
    playerBattle,
    venueInsight,
  } = data;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError("GEMINI_API_KEY missing in environment", 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a professional IPL data analyst.

Your job is NOT to repeat stats.
Your job is to INTERPRET them and give deep match insight.

-------------------------------------

MATCH:
${teamA} vs ${teamB}

WIN PROBABILITY:
${teamA}: ${probability[teamA]}%
${teamB}: ${probability[teamB]}%

TRUST SCORE:
${trustScore}

-------------------------------------

TEAM STATS:
${teamA} -> Win Rate: ${stats[teamA].winRate}, Avg Runs: ${stats[teamA].avgRuns}
${teamB} -> Win Rate: ${stats[teamB].winRate}, Avg Runs: ${stats[teamB].avgRuns}

-------------------------------------

TOP PLAYERS:
${topPlayers?.map((p) => `${p.player} (${p.impactScore})`).join(", ")}

-------------------------------------

PLAYER MATCHUP:
${playerBattle?.batter} vs ${playerBattle?.bowler}
Runs: ${playerBattle?.runs}, Balls: ${playerBattle?.balls}, SR: ${playerBattle?.strikeRate}, Dismissals: ${playerBattle?.dismissals}

-------------------------------------

VENUE:
${venueInsight ? `
Type: ${venueInsight.type}
Avg Runs: ${venueInsight.avgRuns}
` : "No venue data"}

-------------------------------------

INSTRUCTIONS:

Provide a DEEP analysis covering:

1. Match Narrative
- Who has the edge and WHY (not just probability)

2. Team Strength Comparison
- Batting strength
- Consistency vs volatility
- Scoring patterns

3. Key Player Influence
- Which players are driving outcome
- Who can change the match

4. Player Matchup Insight
- Who dominates (batter or bowler)
- Tactical implication

5. Venue Impact
- How pitch conditions affect result
- Whether it benefits batting or bowling side

6. Trust Score Interpretation
- Why confidence is high/low
- What uncertainty exists

-------------------------------------

STYLE:

- Analytical (not generic)
- Insightful (like expert panel discussion)
- Avoid repeating raw numbers
- Explain "WHY", not "WHAT"

-------------------------------------

FORMAT:

Write in structured paragraphs (not bullet points).
Keep it detailed but readable (6-10 lines).
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};

module.exports = { generateExplanation };