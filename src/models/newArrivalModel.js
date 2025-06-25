// models/NewArrival.js

module.exports = (sequelize, DataTypes) => {
  const NewArrival = sequelize.define("NewArrival", {
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

  return NewArrival;
};
