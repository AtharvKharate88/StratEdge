const { getDeliveriesData } = require("../utils/globalStore");
const { getTeamSquadForSeason } = require("../utils/teamSquad");

const getTeamSquad = (req, res) => {
  try {
    const team = String(req.query.team || "").trim();
    const role = String(req.query.role || "batter").toLowerCase();

    if (!team) {
      return res.status(400).json({
        success: false,
        message: "team is required",
      });
    }

    if (role !== "batter" && role !== "bowler") {
      return res.status(400).json({
        success: false,
        message: "role must be batter or bowler",
      });
    }

    const deliveries = getDeliveriesData();
    const { players, season } = getTeamSquadForSeason(deliveries, team, role);

    res.status(200).json({
      success: true,
      data: {
        team,
        role,
        players,
        season,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getTeamSquad };
