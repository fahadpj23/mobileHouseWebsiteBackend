const express = require("express");
const upload = require("../middleware/multer");

const router = express.Router();
const {
  getAllWhatsappAds,
  getWhatsappAdsById,
  addWhatsappAds,
  updateWhatsappAds,
  deleteWhatsappAds,
} = require("../controllers/whatsappAdsController");

router.get("/", getAllWhatsappAds);
router.get("/:id", getWhatsappAdsById);
router.post("/", upload.array("images", 5), addWhatsappAds);
router.put("/:id", updateWhatsappAds);
router.delete("/:id", deleteWhatsappAds);

module.exports = router;
