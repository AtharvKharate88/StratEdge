const express = require("express");
const { explainPrediction } = require("../controller/explanationController");

const router = express.Router();

router.post("/explain", explainPrediction);

module.exports = router;