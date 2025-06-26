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

const NewArrival = db.NewArrival;
const NewArrivalImage = db.NewArrivalImage;

exports.getAllNewArrivals = async (req, res) => {
  try {
    const NewArrival = await NewArrival.findAll();
    res.json(NewArrival);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewArrivalById = async (req, res) => {
  try {
    const NewArrival = await NewArrival.findByPk(req.params.id, {
      include: {
        model: NewArrivalImage,
        as: "images",
      },
    });
    if (!NewArrival)
      return res.status(404).json({ error: "NewArrival not found" });
    res.json(NewArrival);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNewArrival = async (req, res) => {
  try {
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create NewArrival images
    const newArrival = await Promise.all(
      images.map((file, index) =>
        db.NewArrival.create({
          imageUrl: `/uploads/newArrival/${file.filename}`,
          isMain: index === 0, // Set first image as main by default
        })
      )
    );
    res.status(201).json(newArrival);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateNewArrival = async (req, res) => {
  try {
    const { NewArrivalName, ram, storage } = req.body;
    const NewArrival = await NewArrival.findByPk(req.params.id);
    if (!NewArrival)
      return res.status(404).json({ error: "NewArrival not found" });

    NewArrival.NewArrivalName = NewArrivalName || NewArrival.NewArrivalName;
    NewArrival.ram = ram || NewArrival.ram;
    NewArrival.storage = storage || NewArrival.storage;
    await NewArrival.save();

    res.json(NewArrival);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNewArrival = async (req, res) => {
  try {
    const NewArrival = await NewArrival.findByPk(req.params.id);
    if (!NewArrival)
      return res.status(404).json({ error: "NewArrival not found" });

    await NewArrival.destroy();
    res.json({ message: "NewArrival deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
