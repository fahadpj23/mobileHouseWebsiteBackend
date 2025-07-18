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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductVariant,
          as: "variants",
        },
        {
          model: ProductColor,
          as: "colors",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductByBrand = async (req, res) => {
  const brandName = req.params.brand;
  try {
    const products = await db.Product.findAll({
      include: [
        {
          model: ProductVariant,
          as: "variants",
        },
        {
          model: ProductColor,
          as: "colors",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
      where: {
        brand: brandName,
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
      include: [
        {
          model: ProductVariant,
          as: "variants",
          limit: 1,
        },
        {
          model: ProductColor,
          as: "colors",
          limit: 1,
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
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
      include: [
        {
          model: ProductVariant,
          as: "variants",
          limit: 1,
        },
        {
          model: ProductColor,
          as: "colors",
          limit: 1,
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });
    const productsWithSignificantDifferences = products.filter((product) => {
      const difference =
        product?.variants[0]?.mrp - product?.variants[0]?.price;
      const percentageDifference =
        (difference / product?.variants[0]?.mrp) * 100;
      return percentageDifference >= 15;
    });
    res.json(productsWithSignificantDifferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrendingPhone = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const products = await Product.findAll({
      include: [
        {
          model: ProductVariant,
          as: "variants",
          limit: 1,
        },
        {
          model: ProductColor,
          as: "colors",
          limit: 1,
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
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

exports.getProductByIdEdit = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: ProductVariant,
          as: "variants",
        },
        {
          model: ProductColor,
          as: "colors",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id, productVariantId, productColorId } = req.params;

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductVariant,
          as: "variants",
          where: { id: productVariantId },
          required: true,
        },
        {
          model: ProductColor,
          as: "colors",
          where: { id: productColorId },
          required: true,

          include: [
            {
              model: ProductImage,
              as: "images",
            },
          ],
        },
      ],
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found with the given variant and color" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductBySeries = async (req, res) => {
  try {
    const { seriesId } = req.params;

    const product = await Product.findAll({
      where: { seriesId },
      include: [
        {
          model: ProductVariant,
          as: "variants",
          required: true,
        },
        {
          model: ProductColor,
          as: "colors",
          required: true,
          include: [
            {
              model: ProductImage,
              as: "images",
            },
          ],
        },
      ],
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found with the given variant and color" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductColors = async (req, res) => {
  try {
    const { productId } = req.params;

    const colors = await ProductColor.findAll({
      where: {
        productId,
      },
      include: [
        {
          model: ProductImage,
          as: "images",
        },
      ],
    });
    if (!colors) {
      return res
        .status(404)
        .json({ error: "Product not found with the given variant and color" });
    }

    res.json(colors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductVariants = async (req, res) => {
  try {
    const { productId } = req.params;

    const variants = await ProductVariant.findAll({
      where: {
        productId,
      },
    });
    if (!variants) {
      return res
        .status(404)
        .json({ error: "Product not found with the given variant and color" });
    }

    res.json(variants);
  } catch (variants) {
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
      seriesId,
      processor,
      variants,
      colors,
      description,
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
        seriesId,
        launchDate,
        rearCamera,
        battery,
        os,
        processor,
        description,
      },
      { transaction }
    );

    // Parse variants and colors
    const variantData = JSON.parse(variants);
    const colorData = JSON.parse(colors);
    // Get uploaded files
    const uploadedFiles = req.files;
    let fileIndex = 0;
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
    // console.log(createdColors);
    // Create colors and images
    const createdColors = await Promise.all(
      colorData.map(async (color) => {
        const createdColor = await ProductColor.create(
          {
            name: color.name,
            productId: product.id,
          },
          { transaction }
        );

        if (color.images?.length) {
          await Promise.all(
            color.images.map(() => {
              if (fileIndex < uploadedFiles.length) {
                const file = uploadedFiles[fileIndex];
                fileIndex++;
                return ProductImage.create(
                  {
                    colorId: createdColor.id,
                    image: `/uploads/products/${file.filename}`,
                  },
                  { transaction }
                );
              }
              return Promise.resolve();
            })
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
        },
        {
          model: ProductColor,
          as: "colors",
          include: [{ model: ProductImage, as: "images" }],
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
  let transaction;

  try {
    transaction = await sequelize.transaction();
    const { productId } = req.params;
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
      seriesId,
      processor,
      variants,
      colors,
    } = req.body;

    // Update main product details
    await Product.update(
      {
        productName,
        brand,
        category,
        networkType,
        display,
        rating,
        frontCamera,
        seriesId,
        launchDate,
        rearCamera,
        battery,
        os,
        processor,
      },
      {
        where: { id: productId },
        transaction,
      }
    );

    // Parse variants and colors
    const variantData = JSON.parse(variants);
    const colorData = JSON.parse(colors);
    const uploadedFiles = req.files || [];
    let fileIndex = 0;

    // Handle variants - update existing or create new
    await Promise.all(
      variantData.map(async (variant) => {
        if (variant.id) {
          // Update existing variant
          await ProductVariant.update(
            {
              price: variant.price,
              stock: variant.stock,
              ram: variant.ram,
              storage: variant.storage,
              mrp: variant.mrp || variant.price,
            },
            {
              where: { id: variant.id, productId },
              transaction,
            }
          );
        } else {
          // Create new variant
          await ProductVariant.create(
            {
              productId,
              price: variant.price,
              stock: variant.stock,
              ram: variant.ram,
              storage: variant.storage,
              mrp: variant.mrp || variant.price,
            },
            { transaction }
          );
        }
      })
    );

    // Handle colors and images
    await Promise.all(
      colorData.map(async (color) => {
        let colorInstance;

        if (color.id) {
          // Update existing color
          await ProductColor.update(
            { name: color.name },
            {
              where: { id: color.id, productId },
              transaction,
            }
          );
          colorInstance = await ProductColor.findByPk(color.id, {
            transaction,
          });
        } else {
          // Create new color
          colorInstance = await ProductColor.create(
            {
              name: color.name,
              productId,
            },
            { transaction }
          );
        }

        // Handle image deletions
        if (color.deletedImages?.length) {
          await ProductImage.destroy({
            where: {
              id: color.deletedImages,
              colorId: colorInstance.id,
            },
            transaction,
          });
        }

        // Add new images
        if (color.images) {
          await Promise.all(
            color.images.map((img) => {
              if (img.isNew && fileIndex < uploadedFiles.length) {
                const file = uploadedFiles[fileIndex];
                fileIndex++;
                return ProductImage.create(
                  {
                    colorId: colorInstance.id,
                    image: `/uploads/products/${file.filename}`,
                  },
                  { transaction }
                );
              }
              return Promise.resolve();
            })
          );
        }
      })
    );

    // Commit transaction before final fetch
    await transaction.commit();

    // Fetch complete updated product
    const updatedProduct = await Product.findByPk(productId, {
      include: [
        {
          model: ProductVariant,
          as: "variants",
        },
        {
          model: ProductColor,
          as: "colors",
          include: [{ model: ProductImage, as: "images" }],
        },
      ],
    });

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
