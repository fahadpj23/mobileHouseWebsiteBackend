const express = require("express");
const { uploadNewArrival } = require("../middleware/multer");

const router = express.Router();
const {
  getAllNewArrivals,
  getNewArrivalById,
  addNewArrival,
  updateNewArrival,
  deleteNewArrival,
} = require("../controllers/newArrivalController");

router.get("/", getAllNewArrivals);
router.get("/:id", getNewArrivalById);
router.post("/", uploadNewArrival, addNewArrival);
router.put("/:id", updateNewArrival);
router.delete("/:id", deleteNewArrival);

module.exports = router;
