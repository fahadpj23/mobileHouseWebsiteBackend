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
  getProductColors,
  getProductVariants,
  getProductByIdEdit,
  getProductBySeries,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:productId/colors", getProductColors);
router.get("/:productId/variants", getProductVariants);
router.get("/newArrivalProduct", getNewArrival);
router.get("/specialOffer", getSpecialOffer);
router.get("/series/:seriesId", getProductBySeries);
router.get("/trendingPhone", getTrendingPhone);
router.get("/productsList", getProductList);
router.get("/:id/edit", getProductByIdEdit);
router.get("/:id/:productVariantId/:productColorId", getProductById);
router.get("/brand/:brand", getProductByBrand);
router.post("/", uploadProductImages, addProduct);
router.put("/:productId", uploadProductImages, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
