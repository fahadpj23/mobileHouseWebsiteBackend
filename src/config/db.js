// module.exports = {
//   HOST: "database-1.cfe40uka0j0y.ap-south-1.rds.amazonaws.com",
//   USER: "mobileHouse",
//   PASSWORD: "FazilFajar159",
//   DB: "mobileHoueDatabase",
//   dialect: "mysql",
//   port: process.env.DB_PORT || 3306,
//   dialectOptions: {
//     connectTimeout: 60000,
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 60000, // Increase acquire timeout
//     idle: 10000,
//   },
// };

module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "mobile_house_website",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
