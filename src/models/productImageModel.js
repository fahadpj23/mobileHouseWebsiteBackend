// models/ProductImage.js

module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("ProductImage", {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.ProductColor, { foreignKey: "colorId" });
  };

  return ProductImage;
};
