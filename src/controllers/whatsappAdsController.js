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

const WhatsappAds = db.WhatsappAds;
const WhatsappAdsImage = db.WhatsappAdsImage;

exports.getAllWhatsappAds = async (req, res) => {
  try {
    const WhatsappAds = await WhatsappAds.findAll();
    res.json(WhatsappAds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWhatsappAdsById = async (req, res) => {
  try {
    const WhatsappAds = await WhatsappAds.findByPk(req.params.id, {
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
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create WhatsappAds images
    const WhatsappAdsImage = await Promise.all(
      images.map((file, index) =>
        db.WhatsappAdsImage.create({
          imageUrl: `/uploads/${file.filename}`,
          isMain: index === 0, // Set first image as main by default
          WhatsappAdsId: newWhatsappAds.id,
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
    const WhatsappAds = await WhatsappAds.findByPk(req.params.id);
    if (!WhatsappAds)
      return res.status(404).json({ error: "WhatsappAds not found" });

    await WhatsappAds.destroy();
    res.json({ message: "WhatsappAds deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
