# Calculation Formulas (PPT Notes)

This document explains how each metric is calculated in the backend.

## Dataset Inputs

- `data/deliveries.csv`: ball-by-ball events (`match_id`, `batter`, `bowler`, `total_runs`, etc.)
- `data/matches.csv`: match-level mapping data (used for venue analysis when venue metadata is present)

## 1) Team Statistics (from CSV ball-by-ball data)

For each team:

- **Matches Played**
  - Incremented once per match when team appears as either inning-1 batting team or inning-1 bowling team.

- **Wins**
  - If `runs_inning1 > runs_inning2`, inning-1 batting team gets win.
  - If `runs_inning2 > runs_inning1`, other team gets win.

- **Total Runs**
  - Sum of `total_runs` scored by that team across its innings.

- **Win Rate**
  - `winRate = wins / matches`
  - Rounded to 3 decimals.

- **Average Runs**
  - `avgRuns = totalRuns / matches`
  - Rounded to 2 decimals.

---

## 2) Match Prediction Formula (`/api/predict`)

For teams A and B:

- `scoreA = (A.winRate * 0.6) + ((A.avgRuns / (A.avgRuns + B.avgRuns)) * 0.4)`
- `scoreB = (B.winRate * 0.6) + ((B.avgRuns / (A.avgRuns + B.avgRuns)) * 0.4)`

- `totalScore = scoreA + scoreB`

- **Probability**
  - `probA = (scoreA / totalScore) * 100`
  - `probB = (scoreB / totalScore) * 100`
  - Rounded to 2 decimals.

- **Trust Score**
  - `diff = abs(probA - probB)`
  - `trustScore = min(100, diff + 50)`
  - Rounded to 2 decimals.

Interpretation:
- Higher probability gap => higher trust.
- Minimum trust baseline is around 50.

---

## 3) Behavior Classification (`/api/behavior`)

Using request fields: `timeSpent`, `clicks`

- If `timeSpent >= 20` and `clicks >= 5`:
  - `behaviorType = "confused"`

- Else if `timeSpent > 60` and `clicks < 5`:
  - `behaviorType = "confident"`

- Else:
  - `behaviorType = "neutral"`

---

## 4) Player vs Bowler Battle (`/api/player-battle`)

For filtered rows where:
- `ball.batter === batter`
- `ball.bowler === bowler`

Metrics:

- `balls = count(filteredRows)`
- `runs = sum(batsman_runs)`
- `dismissals = count(ball.player_dismissed === batter && ball.is_wicket === "1")`
- `strikeRate = (runs / balls) * 100` (0 if balls=0), rounded to 2 decimals.

### Minimum Data Rule

- If `balls < 10`:
  - `dataStatus = "Not enough data"`
- Else:
  - `dataStatus = "Sufficient data"`

### Dominance Tag

- Default: `"Balanced"`
- If `strikeRate > 140` => `"Batter Dominates"`
- If `dismissals > 2` => `"Bowler Dominates"` (overrides previous tag if both conditions are true)

---

## 5) Player Impact Score (`/api/player-impact`)

Per player (batter):

- `runs = total batsman_runs`
- `balls = total balls faced`
- `matches = unique match_id count`
- `avgRuns = runs / matches`
- `strikeRate = (runs / balls) * 100`
- `consistency = matches`

### Form Factor (This Year / Last Year)

Current dataset has no explicit `year` field, so form is approximated by **match_id recency**:

- Sort all unique `match_id` ascending.
- `bucketSize = floor(totalMatches * 0.2)` (minimum 1).
- Latest bucket => **thisYearIds**
- Previous bucket => **lastYearIds**

Then:

- `thisYearForm = (recentRunsThisYear / recentBallsThisYear) * 100` (0 if no balls)
- `lastYearForm = (recentRunsLastYear / recentBallsLastYear) * 100` (0 if no balls)
- `formFactor = (thisYearForm * 0.6) + (lastYearForm * 0.4)`

### Final Impact Score

- `impactScore = (avgRuns * 0.4) + (strikeRate * 0.25) + (consistency * 0.15) + (formFactor * 0.2)`
- Rounded to 2 decimals.

Players are sorted by `impactScore` in descending order.

---

## PPT-Friendly One-Liner

Our engine combines historical consistency (matches, win rate), scoring quality (avg runs, strike rate), confidence gap (trust score), user behavior signals, and recency-weighted form to generate explainable cricket insights.
