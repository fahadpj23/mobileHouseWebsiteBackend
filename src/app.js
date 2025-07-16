require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const newArrivalRoutes = require("./routes/newArrivalRoutes");
const upcomingRoutes = require("./routes/upcomingRoutes");
const whatsappAdsRoutes = require("./routes/whatsappAdsRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // If you need to send cookies
//   })
// );
// For development (allow all origins)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

app.get("/", (req, res) => {
  res.send("Express.js Server is Running! 🚀");
});

app.use("/api/products", productRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/newArrival", newArrivalRoutes);
app.use("/api/upcoming", upcomingRoutes);
app.use("/api/whatsappAds", whatsappAdsRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
