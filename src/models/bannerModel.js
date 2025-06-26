// models/Banner.js

module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define("Banner", {
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

  return Banner;
};
