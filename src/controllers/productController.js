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

const Product = db.products;

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  console.log("Dsdsd");
  try {
    const {
      name,
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
    let imageUrl = null;
    console.log(req.file);
    if (req.file) {
      // Construct the URL to access the image from the frontend
      // Assuming your server runs on localhost:5000 and static files are served from /uploads
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const newProduct = await Product.create({
      name,
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
      imageUrl,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, ram, storage } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.name = name || product.name;
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
