// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "",
//   DB: "mobile_house_website",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:
    process.env.DB_HOST ||
    "database-1.chygea84cv0y.eu-north-1.rds.amazonaws.com",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "FazilFajar159",
  database: process.env.DB_NAME || "database-1",
  dialect: "mysql", // This is the critical line that was missing
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
