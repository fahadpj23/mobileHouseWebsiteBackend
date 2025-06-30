const db = require("../models");
const path = require("path");
const fs = require("fs");

exports.getAllSeries = async (req, res) => {
  try {
    const Series = await db.Series.findAll();
    res.json(Series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSeriesById = async (req, res) => {
  try {
    const Series = await db.Series.findByPk(req.params.id, {
      include: {
        model: SeriesImage,
        as: "images",
      },
    });
    if (!Series) return res.status(404).json({ error: "Series not found" });
    res.json(Series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addSeries = async (req, res) => {
  try {
    const { seriesName } = req.body;

    const newProduct = await db.Series.create({
      seriesName,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSeries = async (req, res) => {
  try {
    const { SeriesName, ram, storage } = req.body;
    const Series = await Series.findByPk(req.params.id);
    if (!Series) return res.status(404).json({ error: "Series not found" });

    Series.SeriesName = SeriesName || Series.SeriesName;
    Series.ram = ram || Series.ram;
    Series.storage = storage || Series.storage;
    await Series.save();

    res.json(Series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const Series = await db.Series.findByPk(req.params.id);
    if (!Series) return res.status(404).json({ error: "Series not found" });

    await Series.destroy();
    res.json({ message: "Series deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
