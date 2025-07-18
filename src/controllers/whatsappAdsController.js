const db = require("../models");
const removeTablePrefixes = "../../utils/tablePrefixRemove.js";
const path = require("path");
const fs = require("fs");

exports.getAllWhatsappAds = async (req, res) => {
  try {
    const WhatsappAds = await db.WhatsappAds.findAll({
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
      Array.isArray(WhatsappAds) &&
      WhatsappAds.map((item) => ({
        ...item,
        series: item.series.seriesName, // Replace nested object with just the name
      }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWhatsappAdsById = async (req, res) => {
  try {
    const WhatsappAds = await db.WhatsappAds.findByPk(req.params.id, {
      include: {
        model: WhatsappAdsImage,
        as: "images",
      },
    });
    if (!WhatsappAds)
      return res.status(404).json({ error: "WhatsappAds not found" });
    res.json(WhatsappAds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addWhatsappAds = async (req, res) => {
  try {
    const { seriesId } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create WhatsappAds images
    const newWhatsappAds = await Promise.all(
      images.map((file, index) =>
        db.WhatsappAds.create({
          seriesId,
          image: `/uploads/whatsappAds/${file.filename}`,
          isMain: index === 0, // Set first image as main by default
        })
      )
    );
    res.status(201).json(newWhatsappAds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateWhatsappAds = async (req, res) => {
  try {
    const { WhatsappAdsName, ram, storage } = req.body;
    const WhatsappAds = await WhatsappAds.findByPk(req.params.id);
    if (!WhatsappAds)
      return res.status(404).json({ error: "WhatsappAds not found" });

    WhatsappAds.WhatsappAdsName =
      WhatsappAdsName || WhatsappAds.WhatsappAdsName;
    WhatsappAds.ram = ram || WhatsappAds.ram;
    WhatsappAds.storage = storage || WhatsappAds.storage;
    await WhatsappAds.save();

    res.json(WhatsappAds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWhatsappAds = async (req, res) => {
  try {
    const WhatsappAds = await db.WhatsappAds.findByPk(req.params.id);
    if (!WhatsappAds)
      return res.status(404).json({ error: "WhatsappAds not found" });
    const imagePath = path.join(__dirname, "..", WhatsappAds.image);
    // Delete file from disk
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
    await WhatsappAds.destroy();
    res.json({ message: "WhatsappAds deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
