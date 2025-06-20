// models/ProductImage.js
module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define("ProductImage", {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.products, {
      foreignKey: "productId",
      onDelete: "CASCADE",
    });
  };

  return ProductImage;
};
