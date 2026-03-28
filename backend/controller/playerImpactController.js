const { getPlayerImpactData } = require("../utils/globalStore");

const getPlayerImpact = (req, res) => {
  try {
    const top = Number(req.query.top) || 10;

    const result = getPlayerImpactData()
      .filter((row) => row && row.player)
      .slice(0, top);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getPlayerImpact };