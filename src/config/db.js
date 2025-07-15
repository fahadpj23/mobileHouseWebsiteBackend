module.exports = {
  HOST: "database-1.chygea84cv0y.eu-north-1.rds.amazonaws.com",
  USER: "admin",
  PASSWORD: "FazilFajar159",
  DB: "database-1",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

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
