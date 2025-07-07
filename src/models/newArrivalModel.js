// models/NewArrival.js

module.exports = (sequelize, DataTypes) => {
  const NewArrival = sequelize.define("NewArrival", {
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
  NewArrival.associate = (models) => {
    NewArrival.belongsTo(models.Series, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };

  return NewArrival;
};
