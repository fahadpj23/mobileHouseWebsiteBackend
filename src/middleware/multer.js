const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = [
  "src/uploads/banners",
  "src/uploads/products",
  "src/uploads/whatsappAds",
  "src/uploads/newArrival",
  "src/uploads/upcoming",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configurations
const storageConfigs = {
  banner: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/banners");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "banner-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),

  productMain: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/products");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(
        null,
        "product-main-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),

  whatsappAd: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/whatsappAds");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "whatsapp-ad-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),

  newArrival: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/newArrival");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "newArrival" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  upcoming: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "src/uploads/upcoming");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "upcoming" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
};

// Middleware for multiple product images
const uploadProductImages = multer({
  storage: storageConfigs.productMain,
}).array("images", 50); // Allow up to 6 images

const uploadBanner = multer({
  storage: storageConfigs.banner,
}).array("images", 10);

const uploadWhatsappAds = multer({
  storage: storageConfigs.whatsappAd,
}).array("images", 10);

const uploadNewArrival = multer({
  storage: storageConfigs.newArrival,
}).array("images", 10);

const uploadUpcoming = multer({
  storage: storageConfigs.upcoming,
}).array("images", 10);

// Export middleware functions
module.exports = {
  uploadBanner,
  uploadProductImages,
  uploadWhatsappAds,
  uploadNewArrival,
  uploadUpcoming,
};
