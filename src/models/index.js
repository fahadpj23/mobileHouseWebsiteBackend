const dbConfig = require("../config/db");
const Sequelize = require("sequelize");
const DataTypes = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Product = require("./productModel.js")(sequelize, DataTypes);
db.ProductImage = require("./productImageModel.js")(sequelize, DataTypes);
db.Banner = require("./bannerModel.js")(sequelize, DataTypes);
db.NewArrival = require("./newArrivalModel.js")(sequelize, DataTypes);
db.JustLaunched = require("./justLaunchedModel.js")(sequelize, DataTypes);
db.whatsappAds = require("./whatsappAdsModel.js")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // This ensures all associations are set up
  }
});

db.sequelize.sync({ alter: true }).then(() => {
  console.log("sync done");
});

module.exports = db;
