const mysql = require("mysql2");
const process = require("process");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "covid_report",
  password: process.env.DB_PASS
});

module.exports = pool.promise();