const express = require("express");
const { uploadUpcoming } = require("../middleware/multer");

const router = express.Router();
const {
  getAllUpcoming,
  getUpcomingById,
  addUpcoming,
  updateUpcoming,
  deleteUpcoming,
} = require("../controllers/upcomingController");

router.get("/", getAllUpcoming);
router.get("/:id", getUpcomingById);
router.post("/", uploadUpcoming, addUpcoming);
router.put("/:id", updateUpcoming);
router.delete("/:id", deleteUpcoming);

module.exports = router;
