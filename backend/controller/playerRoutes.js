const express = require("express");
const { playerBattle } = require("./playerController");
const { getPlayerImpact } = require("./playerImpactController");

const router = express.Router();

router.get("/player-battle", playerBattle);
router.get("/player-impact", getPlayerImpact);

module.exports = router;