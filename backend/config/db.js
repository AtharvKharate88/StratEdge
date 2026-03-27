const dns = require("dns");
const mongoose = require("mongoose");

const connectDb = async () => {
  const extra = process.env.MONGO_DNS_SERVERS;
  if (extra) {
    dns.setServers(
      extra
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;