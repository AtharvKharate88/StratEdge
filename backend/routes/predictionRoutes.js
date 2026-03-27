const express = require("express");
const { predict } = require("../controller/predictionController");

const router = express.Router();

router.post("/predict", predict);

module.exports = router;