// Récupération du modèle sauces
const Sauce = require("../models/Sauce");

// Import de fs qui permet d'accéder au file-system (pour l'enregistrement d'images)
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
        }`,
    }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateSystem = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like;
  // On prend le userID
  let userId = req.body.userId;
  // On prend l'id de la sauce
  let sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
    .then((sauce => {
      switch(like) {
        case -1 :
          break;
        case 0 :
          break;
        case 1 :
          break;
      }
      // Si un utilisateur met un like, alors on incrémente la valeur du nombre de likes et on stocke l'id de l'utilisateur
      if (like == 1 && !sauce.usersLiked.includes(userId)) {
        sauce.likes += 1;
        sauce.usersLiked.push(userId);
      }
      // Si un utilisateur met un dislike, alors on incrémente la valeur du nombre de dislikes et on stocke l'id de l'utilisateur
      if (like == -1 && !sauce.usersDisliked.includes(userId)) {
        sauce.dislikes += 1;
        sauce.usersDisliked.push(userId);
      }

    })
      .catch((error) => res.status(404).json({ error })));
};
