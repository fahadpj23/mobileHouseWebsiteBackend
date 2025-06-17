require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If you need to send cookies
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Express.js Server is Running! 🚀");
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
