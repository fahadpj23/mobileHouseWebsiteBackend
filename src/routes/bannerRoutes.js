const express = require("express");
const router = express.Router();
const { uploadBanner } = require("../middleware/multer");
const {
  getAllBanner,
  getBannerById,
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.get("/", getAllBanner);
router.get("/:id", getBannerById);
router.post("/", uploadBanner, addBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
