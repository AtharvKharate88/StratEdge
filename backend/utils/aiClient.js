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

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  // 🔥 reduce data (VERY IMPORTANT)
  const safePlayers = (topPlayers || []).slice(0, 2);

  const prompt = `
IPL Analysis:

${teamA} vs ${teamB}

Prob: ${teamA} ${probability[teamA]}%, ${teamB} ${probability[teamB]}%

Stats:
${teamA} WR:${stats[teamA].winRate}, Runs:${stats[teamA].avgRuns}
${teamB} WR:${stats[teamB].winRate}, Runs:${stats[teamB].avgRuns}

Players:
${safePlayers.map(p => `${p.player}:${p.impactScore}`).join(", ")}

Matchup:
${playerBattle?.batter || "N/A"} vs ${playerBattle?.bowler || "N/A"}
SR:${playerBattle?.strikeRate || "-"}

Venue:
${venueInsight?.type || "Unknown"}

Trust:${trustScore}

Output format:
Edge: team + reason (with numbers)
Players: key + impact
Matchup: advantage
Venue: effect
Confidence: level + reason
`;

  try {
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 120, // 🔥 CRITICAL (prevents timeout)
          temperature: 0.6,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), 8000) // 🔥 HARD LIMIT
      ),
    ]);

    return result.response.text();
  } catch (error) {
    console.log("⚠️ AI fallback triggered:", error.message);

    // 🔥 INSTANT FALLBACK (NO WAIT)
    return `
Edge: ${teamA}
Reason: Higher WR (${stats[teamA]?.winRate}) vs ${teamB}

Players: ${safePlayers[0]?.player || "N/A"}
Impact: ${safePlayers[0]?.impactScore || "-"}

Matchup: Balanced
Reason: No strong dominance

Venue: ${venueInsight?.type || "Neutral"}
Effect: Moderate scoring

Confidence: ${
      trustScore > 70 ? "High" : trustScore > 50 ? "Medium" : "Low"
    }
Reason: Trust score ${trustScore}
`;
  }
};

module.exports = { generateExplanation };