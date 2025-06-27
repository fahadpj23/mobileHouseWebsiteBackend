const db = require("../models");

exports.getAllNewArrivals = async (req, res) => {
  try {
    const NewArrival = await db.NewArrival.findAll({
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
      Array.isArray(NewArrival) &&
      NewArrival.map((item) => ({
        ...item,
        series: item.series.seriesName, // Replace nested object with just the name
      }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNewArrivalById = async (req, res) => {
  try {
    const NewArrival = await db.NewArrival.findByPk(req.params.id, {
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
    const { series } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Create NewArrival images
    const newArrival = await Promise.all(
      images.map((file, index) =>
        db.NewArrival.create({
          imageUrl: `/uploads/newArrival/${file.filename}`,
          seriesId: series,
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
    const NewArrival = await db.NewArrival.findByPk(req.params.id);
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
    const NewArrival = await db.NewArrival.findByPk(req.params.id);
    if (!NewArrival)
      return res.status(404).json({ error: "NewArrival not found" });

    await NewArrival.destroy();
    res.json({ message: "NewArrival deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
