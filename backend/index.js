const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");
const logger = require("./utils/logger");
const { loadCSV } = require("./utils/csvLoader");
const { calculateStats } = require("./utils/statsCalculator");
const { setTeamStats } = require("./utils/globalStore");
const { setDeliveriesData } = require("./utils/globalStore");
const playerRoutes = require("./controller/playerRoutes");
const { calculatePlayerImpact } = require("./utils/playerImpact");
const { setPlayerImpactData } = require("./utils/globalStore");
const calculateVenueStats = require("./utils/venueAnalysis");
const { setVenueData } = require("./utils/globalStore");
const venueRoutes = require("./routes/venueRoutes");
const fs = require("fs");
const path = require("path");
dotenv.config();

process.on("unhandledRejection", (reason) => {
  logger.error("unhandledRejection", {
    detail: reason instanceof Error ? reason.message : String(reason),
  });
});

const explanationRoutes = require("./routes/explanationRoutes");
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const predictionRoutes = require("./routes/predictionRoutes");
const historyRoutes = require("./routes/historyRoutes");
const behaviorRoutes = require("./routes/behaviorRoutes");
const startServer = async () => {
  try {
    const matches = await loadCSV("./data/matches.csv");
    const deliveriesPath = fs.existsSync("./data/deliveries.csv")
      ? "./data/deliveries.csv"
      : "./data/deliveries (2).csv";
    const deliveries = await loadCSV(deliveriesPath);
    const stats = calculateStats(matches);
    const impactData = calculatePlayerImpact(deliveries);
    const venueStatsFromCsv = calculateVenueStats(deliveries, matches);

    // Prefer explicit venue metadata file if available.
    const venueJsonPath = path.join(__dirname, "data", "venue.json");
    const venueJsPath = path.join(__dirname, "data", "venue.js");
    let venueStats = venueStatsFromCsv;
    const venueMetaPath = fs.existsSync(venueJsonPath)
      ? venueJsonPath
      : fs.existsSync(venueJsPath)
      ? venueJsPath
      : null;

    if (venueMetaPath) {
      const venueRaw = JSON.parse(fs.readFileSync(venueMetaPath, "utf-8"));
      if (Array.isArray(venueRaw)) {
        venueStats = {};
        venueRaw.forEach((v) => {
          if (v?.venue) {
            venueStats[v.venue] = {
              avgRuns: Number(v.avgRuns || 0),
              matches: Number(v.matches || 0),
              type: v.type || "Balanced",
            };
          }
        });
      } else if (Array.isArray(venueRaw?.ipl_stadiums)) {
        venueStats = {};
        venueRaw.ipl_stadiums.forEach((v) => {
          const name = v?.name;
          if (!name) return;

          const avgRuns =
            Number(v.average_first_innings_score || 0) ||
            Number(v.avgRuns || 0);

          let type = "Balanced";
          const pitch = String(v.pitch_type || "").toLowerCase();
          if (
            pitch.includes("batting") ||
            pitch.includes("high_scoring") ||
            Number(v.batting_rating || 0) > Number(v.bowling_rating || 0)
          ) {
            type = "Batting Friendly";
          } else if (
            pitch.includes("bowling") ||
            pitch.includes("spin") ||
            pitch.includes("slow") ||
            Number(v.bowling_rating || 0) > Number(v.batting_rating || 0)
          ) {
            type = "Bowling Friendly";
          }

          venueStats[name] = {
            avgRuns: Number(avgRuns.toFixed(2)),
            matches: Number(v.matches || 0),
            type,
          };
        });
      } else if (venueRaw && typeof venueRaw === "object") {
        venueStats = venueRaw;
      }
    }
    setTeamStats(stats);
    setDeliveriesData(deliveries);
    setPlayerImpactData(impactData);
    setVenueData(venueStats);
    console.log("✅ CSV Loaded & Stats Ready");

    app.use("/api", authRoutes);
    app.use("/api", predictionRoutes);
    app.use("/api", historyRoutes);
    app.use("/api", behaviorRoutes);
    app.use("/api", explanationRoutes);
    app.use("/api", playerRoutes);
    app.use("/api", venueRoutes);
    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info("Server started", {
        port: PORT,
        env: process.env.NODE_ENV || "development",
      });
    });
  } catch (err) {
    console.error("❌ Error loading CSV:", err);
    process.exit(1);
  }
};

startServer();