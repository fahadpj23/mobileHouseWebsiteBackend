const express = require("express");
const upload = require("../middleware/multer");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { price } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const product = await Product.create({ price });

    // Create product images
    const productImages = await Promise.all(
      images.map((file, index) =>
        ProductImage.create({
          imageUrl: `/images/${file.filename}`,
          isMain: index === 0, // Set first image as main by default
          productId: product.id,
        })
      )
    );

    res.status(201).json({
      ...product.toJSON(),
      images: productImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
