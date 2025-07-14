const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  getAllSeries,
  getSeriesById,
  addSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/seriesController");

router.get("/", getAllSeries);
router.get("/:id", getSeriesById);
router.post("/", addSeries);
router.put("/:id", updateSeries);
router.delete("/:id", deleteSeries);

module.exports = router;
