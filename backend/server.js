// Fichier serveur

const http = require("http"); // Importation du package http
const app = require("./app"); // Importation du fichier de l'application app.js

// Fonction renvoyant un port valide
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Port 3000 utilisé par défaut
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Fonction permettant de rechercher les erreurs et de les traiter  
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur express utilisant l'application app.js
const server = http.createServer(app); // Afin de sécuriser l'application il pourrait être utile d'utiliser HTTPS en installant
// un certificat SSL

// Affichage des éléments et réactions du serveur dans la console
server.on("error", errorHandler); // retourne les erreurs potentielles
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind); // Affiche le port auquel le serveur est connecté
});

server.listen(port);
// Écoute du port défini précédemment
