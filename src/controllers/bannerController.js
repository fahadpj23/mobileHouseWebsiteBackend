const db = require("../models");
const path = require("path");
const fs = require("fs");
const Banner = db.Banner;

exports.getAllBanner = async (req, res) => {
  try {
    const Banner = await db.Banner.findAll({
      include: [
        {
          model: db.Series,
          as: "series",
          attributes: ["seriesName"],
        },
      ],
      raw: true,
      nest: true,
    });

    const result =
      Array.isArray(Banner) &&
      Banner.map((item) => ({
        ...item,
        series: item.series.seriesName, // Replace nested object with just the name
      }));

    res.json(result);
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
    const { series } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create Banner images
    const BannerImage = await Promise.all(
      images.map((file, index) =>
        db.Banner.create({
          seriesId: series,
          image: `/uploads/banners/${file.filename}`,
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
    const Banner = await db.Banner.findByPk(req.params.id);
    if (!Banner) return res.status(404).json({ error: "Banner not found" });
    const imagePath = path.join(__dirname, "..", Banner.image);
    // Delete file from disk
    console.log(imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
          // Continue with deletion even if file deletion fails
        }
      });
    } else {
      console.warn("Image file not found at:", imagePath);
    }
    await db.Banner.destroy({ where: { id: req.params.id } });
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
