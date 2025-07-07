// ProductVariant model - fix the primary key issue
module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define("ProductVariant", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ram: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    mrp: {
      type: DataTypes.INTEGER,
    },
  });

  ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };
  return ProductVariant;
};
