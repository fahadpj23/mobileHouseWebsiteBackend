// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const path = require("path");
// const productRoutes = require("./routes/productRoutes");
// const bannerRoutes = require("./routes/bannerRoutes");
// const newArrivalRoutes = require("./routes/newArrivalRoutes");
// const upcomingRoutes = require("./routes/upcomingRoutes");
// const whatsappAdsRoutes = require("./routes/whatsappAdsRoutes");
// const seriesRoutes = require("./routes/seriesRoutes");
// const userRoutes = require("./routes/userRoutes");

// app.use(express.json()); // Parse JSON requests
// app.use(express.urlencoded({ extended: true }));
// // app.use(cors());
// // app.use(
// //   cors({
// //     origin: "http://localhost:3000",
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     credentials: true, // If you need to send cookies
// //   })
// // );
// // For development (allow all origins)
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// app.get("/", (req, res) => {
//   res.send("Express.js Server is Running! 🚀");
// });

// app.use("/api/products", productRoutes);
// app.use("/api/banner", bannerRoutes);
// app.use("/api/newArrival", newArrivalRoutes);
// app.use("/api/upcoming", upcomingRoutes);
// app.use("/api/whatsappAds", whatsappAdsRoutes);
// app.use("/api/series", seriesRoutes);
// app.use("/api/user", userRoutes);

// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// Import routes
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const newArrivalRoutes = require("./routes/newArrivalRoutes");
const upcomingRoutes = require("./routes/upcomingRoutes");
const whatsappAdsRoutes = require("./routes/whatsappAdsRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const userRoutes = require("./routes/userRoutes");

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// Routes
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

// SSL options
const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Create both HTTP and HTTPS servers
const HTTP_PORT = process.env.PORT || 443;
const HTTPS_PORT = 9000;

// HTTPS server
https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${HTTPS_PORT}`);
});

// HTTP server (optional - redirect to HTTPS)
app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on http://localhost:${HTTP_PORT}`);
});

// Optional: Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
