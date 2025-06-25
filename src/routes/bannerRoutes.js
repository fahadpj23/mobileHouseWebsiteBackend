const express = require("express");
const upload = require("../middleware/multer");

const router = express.Router();
const {
  getAllBanner,
  getBannerById,
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

router.get("/", getAllBanner);
router.get("/:id", getBannerById);
router.post("/", upload.array("images", 5), addBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
