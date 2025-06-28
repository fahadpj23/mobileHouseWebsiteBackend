const db = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const Product = db.Product;
const ProductImage = db.ProductImage;

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: ProductImage,
        as: "images",
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewArrival = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const products = await Product.findAll({
      include: {
        model: ProductImage,
        as: "images",
      },
      where: {
        launchDate: {
          [Op.gte]: sixMonthsAgo, // Greater than or equal to 6 months ago
        },
      },
      order: [["launchDate", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSpecialOffer = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const products = await Product.findAll({
      include: {
        model: ProductImage,
        as: "images",
      },
      where: {
        [Op.and]: [
          { mrp: { [Op.gt]: 0 } },
          sequelize.where(sequelize.literal("((mrp - price) / mrp) * 100"), {
            [Op.gt]: 15,
          }),
        ],
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrendingPhone = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const products = await Product.findAll({
      include: {
        model: ProductImage,
        as: "images",
      },
      where: {
        rating: {
          [Op.gte]: 4, // Greater than or equal to 4
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductList = async (req, res) => {
  try {
    const {
      brands,
      minPrice,
      maxPrice,
      rating,
      ram,
      storage,
      sortBy,
      sortOrder = "ASC",
      page = 1,
      limit = 10,
    } = req.query;

    // Prepare filter object
    const where = {};

    // 1. Brand Filter (accepts array or comma-separated string)
    if (brands) {
      const brandArray = Array.isArray(brands) ? brands : brands.split(",");
      where.brand = {
        [Op.in]: brandArray,
      };
    }
    if (ram) {
      const ramArray = Array.isArray(ram) ? ram : ram.split(",");
      console.log(ramArray);
      where.ram = {
        [Op.in]: ramArray,
      };
    }
    if (storage) {
      const storageArray = Array.isArray(storage)
        ? storage
        : storage.split(",");
      where.storage = {
        [Op.in]: storageArray,
      };
    }

    // 2. Price Range Filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // 3. Rating Filter
    if (rating) {
      where.rating = {
        [Op.gte]: parseFloat(rating),
      };
    }

    // Sorting options
    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder]);
    } else {
      order.push(["createdAt", "DESC"]); // Default sorting
    }

    // Pagination
    const offset = (page - 1) * limit;

    // Execute query
    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      success: true,
      totalProducts: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      products: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: ProductImage,
        as: "images",
      },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      ram,
      storage,
      price,
      mrp,
      brand,
      series,
      color,
      networkType,
      category,
      display,
      launchDate,
      frontCamera,
      rating,
      rearCamera,
      os,
      processor,
      battery,
    } = req.body;

    const newProduct = await Product.create({
      productName,
      ram,
      storage,
      price,
      mrp,
      brand,
      color,
      seriesId: series,
      networkType,
      category,
      rating,
      display,
      frontCamera,
      rearCamera,
      os,
      processor,
      launchDate,
      battery,
    });

    try {
      const images = req.files;

      if (!images || images.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one image is required" });
      }

      // Create product images
      const productImage = await Promise.all(
        images.map((file, index) =>
          db.ProductImage.create({
            imageUrl: `/uploads/${file.filename}`,
            isMain: index === 0, // Set first image as main by default
            productId: newProduct.id,
          })
        )
      );
      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productName, ram, storage } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.productName = productName || product.productName;
    product.ram = ram || product.ram;
    product.storage = storage || product.storage;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
