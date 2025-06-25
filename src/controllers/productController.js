const db = require("../models");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Images will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

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
  try {
    const {
      productName,
      ram,
      storage,
      price,
      mrp,
      brand,
      series,
      networkType,
      category,
      display,
      frontCamera,
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
      series,
      networkType,
      category,
      display,
      frontCamera,
      rearCamera,
      os,
      processor,
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
