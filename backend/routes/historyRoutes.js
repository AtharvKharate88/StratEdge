const express = require("express");
const { getHistory } = require("../controller/historyController");

const router = express.Router();

router.get("/history", getHistory);

module.exports = router;