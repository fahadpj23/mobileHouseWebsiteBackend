// models/WhatsappAds.js

module.exports = (sequelize, DataTypes) => {
  const WhatsappAds = sequelize.define("WhatsappAds", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return WhatsappAds;
};
