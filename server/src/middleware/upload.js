// server/src/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Carpeta donde se guardarán los videos (ajusta si tu estructura difiere)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../player/multimediaContent/videos'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Solo permitir .mp4
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos MP4"), false);
  }
};

module.exports = multer({ storage, fileFilter });