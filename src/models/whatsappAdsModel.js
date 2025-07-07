// models/WhatsappAds.js

module.exports = (sequelize, DataTypes) => {
  const WhatsappAds = sequelize.define("WhatsappAds", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seriesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  WhatsappAds.associate = (models) => {
    WhatsappAds.belongsTo(models.Series, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };

  return WhatsappAds;
};
