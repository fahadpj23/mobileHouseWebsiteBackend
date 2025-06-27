const db = require("../models");
const multer = require("multer");
// const upload = multer({ storage: storage });

exports.getAllJustLaunched = async (req, res) => {
  try {
    const JustLaunched = await db.JustLaunched.findAll();
    res.json(JustLaunched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJustLaunchedById = async (req, res) => {
  try {
    const JustLaunched = await JustLaunched.findByPk(req.params.id, {
      include: {
        model: JustLaunchedImage,
        as: "images",
      },
    });
    if (!JustLaunched)
      return res.status(404).json({ error: "JustLaunched not found" });
    res.json(JustLaunched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addJustLaunched = async (req, res) => {
  try {
    const { series } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create NewArrival images
    const JustLaunched = await Promise.all(
      images.map((file, index) =>
        db.JustLaunched.create({
          series: series,
          imageUrl: `/uploads/justLaunched/${file.filename}`,
          isMain: index === 0, // Set first image as main by default
        })
      )
    );
    res.status(201).json(JustLaunched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateJustLaunched = async (req, res) => {
  try {
    const { JustLaunchedName, ram, storage } = req.body;
    const JustLaunched = await JustLaunched.findByPk(req.params.id);
    if (!JustLaunched)
      return res.status(404).json({ error: "JustLaunched not found" });

    // JustLaunched.JustLaunchedName =
    //   JustLaunchedName || JustLaunched.JustLaunchedName;
    // JustLaunched.ram = ram || JustLaunched.ram;
    // JustLaunched.storage = storage || JustLaunched.storage;
    await JustLaunched.save();

    res.json(JustLaunched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteJustLaunched = async (req, res) => {
  try {
    const JustLaunched = await JustLaunched.findByPk(req.params.id);
    if (!JustLaunched)
      return res.status(404).json({ error: "JustLaunched not found" });

    await JustLaunched.destroy();
    res.json({ message: "JustLaunched deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
