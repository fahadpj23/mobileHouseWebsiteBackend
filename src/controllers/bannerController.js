const db = require("../models");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Images will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

const Banner = db.Banner;

exports.getAllBanner = async (req, res) => {
  try {
    const Banner = await db.Banner.findAll();
    res.json(Banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const Banner = await db.Banner.findByPk(req.params.id, {
      include: {
        model: BannerImage,
        as: "images",
      },
    });
    if (!Banner) return res.status(404).json({ error: "Banner not found" });
    res.json(Banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addBanner = async (req, res) => {
  try {
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create Banner images
    const BannerImage = await Promise.all(
      images.map((file, index) =>
        db.Banner.create({
          imageUrl: `/uploads/${file.filename}`,
        })
      )
    );
    res.status(201).json(BannerImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { BannerName, ram, storage } = req.body;
    const Banner = await Banner.findByPk(req.params.id);
    if (!Banner) return res.status(404).json({ error: "Banner not found" });

    Banner.BannerName = BannerName || Banner.BannerName;
    Banner.ram = ram || Banner.ram;
    Banner.storage = storage || Banner.storage;
    await Banner.save();

    res.json(Banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const Banner = await Banner.findByPk(req.params.id);
    if (!Banner) return res.status(404).json({ error: "Banner not found" });

    await Banner.destroy();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
