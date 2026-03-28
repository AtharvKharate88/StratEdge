/**
 * IPL ball-by-ball CSVs often use `batsman`; some exports use `batter`.
 */
function strikerName(d) {
  if (!d) return "";
  const v = d.batter ?? d.batsman;
  if (v == null) return "";
  return String(v).trim();
}

function bowlerName(d) {
  if (!d) return "";
  const v = d.bowler;
  if (v == null) return "";
  return String(v).trim();
}

module.exports = { strikerName, bowlerName };
