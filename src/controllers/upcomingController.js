const db = require("../models");
const path = require("path");
const fs = require("fs");

exports.getAllUpcoming = async (req, res) => {
  try {
    const Upcoming = await db.Upcoming.findAll({
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
      Array.isArray(Upcoming) &&
      Upcoming.map((item) => ({
        ...item,
        series: item.series.seriesName, // Replace nested object with just the name
      }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcomingById = async (req, res) => {
  try {
    const Upcoming = await Upcoming.findByPk(req.params.id, {
      include: {
        model: UpcomingImage,
        as: "images",
      },
    });
    if (!Upcoming) return res.status(404).json({ error: "Upcoming not found" });
    res.json(Upcoming);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addUpcoming = async (req, res) => {
  try {
    const { seriesId } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create Upcoming images
    const Upcoming = await Promise.all(
      images.map((file, index) =>
        db.Upcoming.create({
          seriesId,
          image: `/uploads/Upcoming/${file.filename}`,
          isMain: index === 0, // Set first image as main by default
        })
      )
    );
    res.status(201).json(Upcoming);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUpcoming = async (req, res) => {
  try {
    const { UpcomingName, ram, storage } = req.body;
    const Upcoming = await Upcoming.findByPk(req.params.id);
    if (!Upcoming) return res.status(404).json({ error: "Upcoming not found" });

    // Upcoming.UpcomingName =
    //   UpcomingName || Upcoming.UpcomingName;
    // Upcoming.ram = ram || Upcoming.ram;
    // Upcoming.storage = storage || Upcoming.storage;
    await Upcoming.save();

    res.json(Upcoming);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUpcoming = async (req, res) => {
  try {
    const Upcoming = await db.Upcoming.findByPk(req.params.id);
    if (!Upcoming) return res.status(404).json({ error: "Upcoming not found" });
    const imagePath = path.join(__dirname, "..", Upcoming.image);
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
    await Upcoming.destroy();
    res.json({ message: "Upcoming deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
