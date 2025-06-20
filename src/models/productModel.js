module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define("products", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ram: {
      type: DataTypes.INTEGER,
    },
    storage: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    series: {
      type: DataTypes.STRING,
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
    imageUrl: {
      // Store the path or URL to the image
      type: DataTypes.STRING,
      allowNull: true, // Can be null if no image is uploaded
    },
  });
  return product;
};
