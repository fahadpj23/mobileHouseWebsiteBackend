// models/JustLaunched.js

module.exports = (sequelize, DataTypes) => {
  const JustLaunched = sequelize.define("JustLaunched", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    series: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return JustLaunched;
};
