const { getDeliveriesData } = require("../utils/globalStore");
const { getPlayerBattleStats } = require("../utils/playerBattle");

const resolvePlayerName = (inputName, players) => {
  if (!inputName) return inputName;
  const normalizedInput = inputName.trim().toLowerCase();

  // Exact match first
  const exact = players.find((p) => p.toLowerCase() === normalizedInput);
  if (exact) return exact;

  // Fallback for names like "Virat Kohli" -> "V Kohli", "Jasprit Bumrah" -> "JJ Bumrah"
  const parts = normalizedInput.split(/\s+/).filter(Boolean);
  const lastName = parts[parts.length - 1];
  const firstInitial = parts[0]?.[0];

  const candidate = players.find((p) => {
    const pLower = p.toLowerCase();
    const pParts = pLower.split(/\s+/).filter(Boolean);
    const pLast = pParts[pParts.length - 1];
    const pInitials = pParts[0] || "";
    return pLast === lastName && firstInitial && pInitials.startsWith(firstInitial);
  });

  return candidate || inputName;
};

const playerBattle = (req, res) => {
  try {
    const { batter, bowler } = req.query;

    if (!batter || !bowler) {
      return res.status(400).json({
        success: false,
        message: "batter and bowler are required",
      });
    }

    const deliveries = getDeliveriesData();
    const batters = [...new Set(deliveries.map((d) => d.batter).filter(Boolean))];
    const bowlers = [...new Set(deliveries.map((d) => d.bowler).filter(Boolean))];

    const resolvedBatter = resolvePlayerName(batter, batters);
    const resolvedBowler = resolvePlayerName(bowler, bowlers);

    const result = getPlayerBattleStats(resolvedBatter, resolvedBowler, deliveries);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { playerBattle };