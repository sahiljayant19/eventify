// db.js
const mysql = require("mysql2");
const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        console.error("Full error details:", err);
    } else {
        console.log("✅ Connected to MySQL Pool");
        connection.release();
    }
});

// Export the promise-based pool for easier async/await usage if needed, 
// but keeping the standard callback-based export to match existing code.
module.exports = pool;