const express = require("express");
const { uploadWhatsappAds } = require("../middleware/multer");

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
router.post("/", uploadWhatsappAds, addWhatsappAds);
router.put("/:id", updateWhatsappAds);
router.delete("/:id", deleteWhatsappAds);

module.exports = router;
