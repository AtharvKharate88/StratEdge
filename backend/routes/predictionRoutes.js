const express = require("express");
const verifyToken = require("../middleware/auth");
const { predict } = require("../controller/predictionController");

const router = express.Router();

router.post("/predict", verifyToken, predict);

module.exports = router;