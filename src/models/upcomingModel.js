// models/Upcoming.js

module.exports = (sequelize, DataTypes) => {
  const Upcoming = sequelize.define("Upcoming", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seriesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Upcoming.associate = (models) => {
    Upcoming.belongsTo(models.Series, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };

  return Upcoming;
};
