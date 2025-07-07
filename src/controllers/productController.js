const db = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");

const path = require("path");
const fs = require("fs");
// controllers/productController.js
const {
  Product,
  ProductVariant,
  ProductColor,
  ProductImage,
} = require("../models");
const uploadProductImages = require("../middleware/multer");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: [
        {
          model: ProductVariant,
          as: "variants",
          include: [
            {
              model: ProductColor,
              as: "colors",
              include: [{ model: ProductImage, as: "images" }],
            },
          ],
        },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductByBrand = async (req, res) => {
  console.log(req.params.brand);
  try {
    const products = await db.Product.findAll({
      include: {
        model: db.ProductImage,
        as: "images",
      },
      where: {
        brand: "vivo",
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
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const {
      productName,
      brand,
      category,
      networkType,
      display,
      rating,
      frontCamera,
      launchDate,
      rearCamera,
      battery,
      os,
      series,
      processor,
      variants,
      colors,
    } = req.body;

    // Create product
    const product = await Product.create(
      {
        productName,
        brand,
        category,
        networkType,
        display,
        rating,
        frontCamera,
        seriesId: series,
        launchDate,
        rearCamera,
        battery,
        os,
        processor,
      },
      { transaction }
    );

    // Parse variants and colors
    const variantData = JSON.parse(variants);
    const colorData = JSON.parse(colors);

    // Create product variants
    const createdVariants = await Promise.all(
      variantData.map((variant) =>
        ProductVariant.create(
          {
            productId: product.id,
            price: variant.price,
            stock: variant.stock,
            ram: variant.ram,
            storage: variant.storage,
            mrp: variant.mrp || variant.price,
          },
          { transaction }
        )
      )
    );

    // Create colors and images
    const createdColors = await Promise.all(
      colorData.map(async (color) => {
        const createdColor = await ProductColor.create(
          {
            productId: product.id,
            name: color.color,
          },
          { transaction }
        );

        if (color.images?.length) {
          await Promise.all(
            color.images.map((image) =>
              ProductImage.create(
                {
                  colorId: createdColor.id,
                  image: `/uploads/products/${image.filename}`,
                },
                { transaction }
              )
            )
          );
        }
        return createdColor;
      })
    );

    // Commit transaction before final fetch
    await transaction.commit();

    // Fetch complete product WITHOUT transaction
    const completeProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: ProductVariant,
          as: "variants",
          include: [
            {
              model: ProductColor,
              as: "colors",
              include: [{ model: ProductImage, as: "images" }],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      product: completeProduct,
    });
  } catch (error) {
    // Only rollback if transaction exists and isn't finished
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
    const product = await db.Product.findByPk(req.params.id, {
      include: {
        model: db.ProductImage, // Fixed: Use db.ProductImage
        as: "images",
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete associated images from filesystem (if they exist)
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          const imagePath = path.join(__dirname, "..", image.image);
          console.log(imagePath);
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath); // Synchronous deletion (or use fs.promises.unlink)
            } else {
              console.log("image not found");
            }
          } catch (err) {
            console.error("Error deleting image file:", err);
          }
        })
      );
    }

    // Delete the product from the database
    await db.Product.destroy({
      where: { id: req.params.id }, // REQUIRED: Specify which product to delete
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
