let passwordSchema = require('../models/Password'); // Importation du modèle de mot de passe créé

// Vérificaiton du mot de passe afin qu'il corresponde aux contraintes
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) { // Si le mot de passe ne correspond pas
        return res.status(400).json({ error: "Format de mot de passe incorrect (minimum 8 caractères, maximum 100, au moins une majuscule, une minuscule et un chiffre, pas d'espaces" });
    } else {
        next();
    }
};