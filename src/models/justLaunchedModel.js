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
    seriesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  JustLaunched.associate = (models) => {
    JustLaunched.belongsTo(models.Series, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };

  return JustLaunched;
};
