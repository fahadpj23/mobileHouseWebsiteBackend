const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = [
  "uploads/banners",
  "uploads/products",
  "uploads/whatsapp-ads",
  "uploads/newArrival",
  "uploads/justLaunched",
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
      cb(null, "uploads/banners");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "banner-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),

  productMain: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/products");
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
      cb(null, "uploads/whatsapp-ads");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "whatsapp-ad-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),

  newArrival: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/newArrival");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "newArrival" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  justLaunched: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/justLaunched");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
      cb(null, "justLaunched" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
};

// Middleware for multiple product images
const uploadProductImages = multer({
  storage: storageConfigs.productMain,
}).array("images", 6); // Allow up to 6 images

const uploadBanner = multer({
  storage: storageConfigs.banner,
}).array("images", 10);

const uploadWhatsappAds = multer({
  storage: storageConfigs.whatsappAd,
}).array("images", 10);

const uploadNewArrival = multer({
  storage: storageConfigs.newArrival,
}).array("images", 10);

const uploadJustLaunched = multer({
  storage: storageConfigs.justLaunched,
}).array("images", 10);

// Export middleware functions
module.exports = {
  uploadBanner,
  uploadProductImages,
  uploadWhatsappAds,
  uploadNewArrival,
  uploadJustLaunched,
};
