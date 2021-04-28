const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // Garantit le fait que le mail est unique

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}); // Schéma de l'utilisateur

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema); // Exportation du schéma pour le controller
