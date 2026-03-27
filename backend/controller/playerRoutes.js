const express = require("express");
const { playerBattle } = require("./playerController");
const { getPlayerImpact } = require("./playerImpactController");
const { getTeamSquad } = require("./teamSquadController");
const { getDashboardMetrics } = require("./dashboardController");

const router = express.Router();

router.get("/player-battle", playerBattle);
router.get("/player-impact", getPlayerImpact);
router.get("/team-squad", getTeamSquad);
router.get("/dashboard-metrics", getDashboardMetrics);

module.exports = router;