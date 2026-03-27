const { getVenueData } = require("../utils/globalStore");

const getVenueInsight = (req, res) => {
  try {
    const { venue } = req.query;

    if (!venue) {
      return res.status(400).json({
        success: false,
        message: "venue is required",
      });
    }

    const venueData = getVenueData();
    const allVenues = Object.keys(venueData || {});

    if (!allVenues.length) {
      return res.status(500).json({
        success: false,
        message: "Venue metadata not loaded. Add data/venue.json or data/venue.js, or ensure CSV contains venue column.",
      });
    }

    const exactKey = allVenues.find(
      (v) => v.trim().toLowerCase() === String(venue).trim().toLowerCase()
    );
    const data = exactKey ? venueData[exactKey] : null;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
        availableVenues: allVenues.slice(0, 10),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        venue: exactKey,
        ...data,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getVenueInsight };