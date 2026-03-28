const express = require("express");
const verifyToken = require("../middleware/auth");
const { getHistory } = require("../controller/historyController");

const router = express.Router();

router.get("/history", verifyToken, getHistory);

module.exports = router;