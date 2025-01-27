const mysql = require("mysql2/promise");
require("dotenv").config();

// Create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "sahil",
  password: process.env.MYSQL_PASSWORD,
  database: "OAuth_validation",
});

module.exports = pool;
