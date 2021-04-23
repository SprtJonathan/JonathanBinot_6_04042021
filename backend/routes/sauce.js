const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce"); // Récupération du controlleur lié à la sauce
const auth = require("../middleware/auth"); // Récupération du middleware d'authentification pour sécuriser toutes les routes
const multer = require("../middleware/multer-config") // Récupération du middleware multer pour pouvoir récupérer les images

router.post("/", auth, multer, sauceCtrl.createSauce); // Route POST pour la création de sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce); // Route PUT pour la modification de la sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce); // Route DELETE pour la suppresion d'une sauce (avec son ID)
router.get("/:id", auth, sauceCtrl.getOneSauce); // Route GET pour la récupération d'une sauce (avec son ID)
router.get("/", auth, sauceCtrl.getAllSauces); // Route GET pour la récupération de toutes les sauces
router.post("/:id/like", auth, sauceCtrl.rateSauce); // Route POST pour l'ajout ou la suppression d'un avis (like ou dislike)

module.exports = router;
