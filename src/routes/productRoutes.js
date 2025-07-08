const express = require("express");
const { uploadProductImages } = require("../middleware/multer");

const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getNewArrival,
  getSpecialOffer,
  getTrendingPhone,
  getProductList,
  getProductByBrand,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/newArrival", getNewArrival);
router.get("/specialOffer", getSpecialOffer);
router.get("/trendingPhone", getTrendingPhone);
router.get("/productsList", getProductList);
router.get("/:id", getProductById);
router.get("/brand/:brand", getProductByBrand);
router.post("/", uploadProductImages, addProduct);
router.put("/:productId", uploadProductImages, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
