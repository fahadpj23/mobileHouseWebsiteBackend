const express = require("express");
const upload = require("../middleware/multer");

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
router.post("/", upload.array("images", 5), addNewArrival);
router.put("/:id", updateNewArrival);
router.delete("/:id", deleteNewArrival);

module.exports = router;
