const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

module.exports = pool;