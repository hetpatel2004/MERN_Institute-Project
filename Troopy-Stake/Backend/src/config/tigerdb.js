const { Pool } = require("pg");

const tigerPool = new Pool({
  connectionString: process.env.TIGER_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

tigerPool.connect()
  .then(() => console.log("TigerData Connected Successfully"))
  .catch((err) => console.log("TigerData Error:", err.message));

module.exports = tigerPool;