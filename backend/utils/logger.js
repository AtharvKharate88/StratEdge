const log = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();

  const logEntry = {
    level,
    timestamp,
    message,
    ...meta,
  };

  console.log(JSON.stringify(logEntry));
};

const logger = {
  info: (message, meta) => log("INFO", message, meta),
  error: (message, meta) => log("ERROR", message, meta),
};

module.exports = logger;