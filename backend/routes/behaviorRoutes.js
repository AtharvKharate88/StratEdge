const express = require("express");
const { trackBehavior } = require("../controller/behaviorController");

const router = express.Router();

router.post("/behavior", trackBehavior);

module.exports = router;