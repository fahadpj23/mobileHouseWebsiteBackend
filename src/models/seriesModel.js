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
  Series.associate = (models) => {
    Series.hasMany(models.WhatsappAds, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };
  Series.associate = (models) => {
    Series.hasMany(models.NewArrival, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };
  Series.associate = (models) => {
    Series.hasMany(models.Upcoming, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };
  Series.associate = (models) => {
    Series.hasMany(models.Banner, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };
  Series.associate = (models) => {
    Series.hasMany(models.Product, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };

  return Series;
};
