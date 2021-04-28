let passwordValidator = require('password-validator');

// Création du schéma d'un mot de passe sécurisé
let passwordSchema = new passwordValidator();

// Contraintes du mot de passe
passwordSchema
.is().min(8)                                    // Longueur minimum 8
.is().max(100)                                  // Longueur maximum 100
.has().uppercase()                              // Doit avoir des lettres en majuscule
.has().lowercase()                              // Doit avoir des lettres en minuscule
.has().digits(1)                                // Doit avoir au moins 1 chiffre
.has().not().spaces()                           // Ne peut pas avoi d'espaces
.is().not().oneOf(['Passw0rd', 'Password123', 'motdepasse', '12345678']); // Blacklist these values

module.exports = passwordSchema;