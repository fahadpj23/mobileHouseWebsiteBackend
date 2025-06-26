const db = require("../models");

exports.getAllWhatsappAds = async (req, res) => {
  try {
    const WhatsappAds = await db.whatsappAds.findAll();
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
    const { series } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create WhatsappAds images
    const newWhatsappAds = await Promise.all(
      images.map((file, index) =>
        db.whatsappAds.create({
          series: series,
          imageUrl: `/uploads/whatsappAds/${file.filename}`,
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
    const WhatsappAds = await WhatsappAds.findByPk(req.params.id);
    if (!WhatsappAds)
      return res.status(404).json({ error: "WhatsappAds not found" });

    await WhatsappAds.destroy();
    res.json({ message: "WhatsappAds deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
