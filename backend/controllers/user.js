const bcrypt = require("bcrypt"); // Package permettant de chiffrer les mots de passes
const jwt = require("jsonwebtoken"); // JSON Web Token : Jeton d'authentification utilisé afin de ne pas redemander la connexion à chaque requête

const validator = require('validator'); // Le validateur permet de vérifier que le format d'email entré est correct

const User = require("../models/User"); // Importation du modèle d'utilisateur

exports.signup = (req, res, next) => { // Middleware pour l'inscription
  bcrypt
    .hash(req.body.password, 10) // Salage du mot de passe 10 fois
    .then((hash) => {
      if (validator.isEmail(req.body.email)) { // Si la forme de l'email est correcte, alors on crée le nouvel utilisateur
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error })); // Si un des éléments est invalide, alors on renvoie une erreur 400

      }
      else {
        return res.status(400).json({ error: "Format email incorrect" });
      }
    })

    .catch((error) => res.status(500).json({ error })); // Si une erreur est retournée, elle provient du serveur, alors on renvoie un code 500
};

exports.login = (req, res, next) => { // Middleware pour la connexion
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" }); // Si l'utilisateur a entré de mauvaises informations (ou que l'utilisateur entré n'existe pas dans la BDD)
      } // On renvoie une erreur 401
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe invalide" }); // Si le mot de passe entré n'est pas le bon, on renvoie une erreur 401
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error })); // Si une erreur est retournée, elle provient du serveur, alors on renvoie un code 500
};
