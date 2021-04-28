const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const passwordValidation = require('../middleware/password-validation')

router.post("/signup", passwordValidation, userCtrl.signup); // Route pour l'inscription d'un utilisateur / On vérifie que le mot de passe corresponde
router.post("/login", userCtrl.login); // Route pour la connexion d'un utilisateur

module.exports = router;