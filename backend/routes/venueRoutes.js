const express = require("express");
const { getVenueInsight } = require("../controller/venueController");

const router = express.Router();

router.get("/venue-insight", getVenueInsight);

module.exports = router;
