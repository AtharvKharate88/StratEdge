/**
 * Maps UI / canonical IPL names to equivalent names used in historical CSV data.
 */
const FRANCHISE_GROUPS = [
  ["Royal Challengers Bengaluru", "Royal Challengers Bangalore"],
  ["Punjab Kings", "Kings XI Punjab"],
  ["Delhi Capitals", "Delhi Daredevils"],
  ["Gujarat Titans", "Gujarat Lions"],
]

function franchiseGroupForName(name) {
  if (!name) return null
  for (const g of FRANCHISE_GROUPS) {
    if (g.includes(name)) return g
  }
  return [name]
}

function teamsSameFranchise(a, b) {
  if (!a || !b) return false
  if (a === b) return true
  const ga = franchiseGroupForName(a)
  const gb = franchiseGroupForName(b)
  return ga.some((x) => gb.includes(x))
}

/**
 * Find the key present in stats that matches this franchise (e.g. UI "RCB" -> CSV "Royal Challengers Bangalore").
 */
function resolveTeamKeyInStats(requestedName, stats) {
  if (!requestedName || !stats || typeof stats !== "object") return null
  if (stats[requestedName]) return requestedName
  for (const key of Object.keys(stats)) {
    if (teamsSameFranchise(requestedName, key)) return key
  }
  return null
}

/**
 * All CSV team spellings that belong to the same franchise as the selected team.
 */
function csvTeamAliasesForSelection(canonicalTeam) {
  const group = franchiseGroupForName(canonicalTeam)
  return group.length ? group : [canonicalTeam]
}

module.exports = {
  teamsSameFranchise,
  resolveTeamKeyInStats,
  csvTeamAliasesForSelection,
}
