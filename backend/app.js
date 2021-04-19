const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// Utilisation de helmet :
// Il protège l'application de vulnérabilités répandues.
// C'est une collection de middlewares liés à la sécurité des requêtes HTTP
let helmet = require("helmet");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Sécurisation des identifiants de connexion au cluster dans une variable d'environnement
const dotenv = require("dotenv");
dotenv.config();

// Connexion à la base
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(function (req, res, next) {
  // Le site auquel 'lutilisateur souhaite se connecter
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Les requêtes autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

  // Les headers autorisés
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  
  // On passe au middleware suivant
  next();
});

app.use(bodyParser.json());

app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
