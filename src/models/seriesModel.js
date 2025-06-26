module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define("Series", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seriesName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Series;
};
