module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seriesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    networkType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    display: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    launchDate: {
      type: DataTypes.DATE,
    },
    frontCamera: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rearCamera: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    battery: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    os: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    processor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Product.associate = (models) => {
    Product.hasMany(models.ProductVariant, {
      foreignKey: "productId",
      as: "variants",
    });

    Product.belongsTo(models.Series, {
      foreignKey: "seriesId",
      as: "series",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
