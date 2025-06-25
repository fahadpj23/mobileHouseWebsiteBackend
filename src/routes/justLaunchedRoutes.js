const express = require("express");
const { uploadJustLaunched } = require("../middleware/multer");

const router = express.Router();
const {
  getAllJustLaunched,
  getJustLaunchedById,
  addJustLaunched,
  updateJustLaunched,
  deleteJustLaunched,
} = require("../controllers/justLaunchedController");

router.get("/", getAllJustLaunched);
router.get("/:id", getJustLaunchedById);
router.post("/", uploadJustLaunched, addJustLaunched);
router.put("/:id", updateJustLaunched);
router.delete("/:id", deleteJustLaunched);

module.exports = router;
