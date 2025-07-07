module.exports = (sequelize, DataTypes) => {
  const ProductColor = sequelize.define("ProductColor", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  ProductColor.associate = (models) => {
    ProductColor.belongsTo(models.Product, { foreignKey: "productId" });
    ProductColor.hasMany(models.ProductImage, {
      foreignKey: "colorId",
      as: "images",
    });
  };

  return ProductColor;
};
