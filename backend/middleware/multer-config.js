const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
}; // Extensions de fichiers reconnues par multer

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Récupération du fichier et renommage en supprimant les espaces
    const extension = MIME_TYPES[file.mimetype]; // ajout de l'extension selon le type de fichier reçu
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image"); // Exportation
