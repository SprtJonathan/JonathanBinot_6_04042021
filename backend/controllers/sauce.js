// Récupération du modèle sauces
const Sauce = require("../models/Sauce");

// Import de fs qui permet d'accéder au file-system (pour l'enregistrement d'images)
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
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

exports.rateSauce = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like;
  // On prend le userID
  let userId = req.body.userId;
  // On prend l'id de la sauce
  let sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId }).then((sauce) => {
    switch (like) {
      // Si un utilisateur met un dislike, alors on incrémente la valeur du nombre de dislikes et on stocke l'id de l'utilisateur
      case -1:
        Sauce.updateOne(
          {
            _id: sauceId,
          },
          {
            $push: {
              usersDisliked: userId,
            }, // On envoie l'id de l'utilisateur à la BDD
            $inc: {
              dislikes: +1,
            }, // On incrémente le nombre de dislikes de 1
            _id: sauceId,
          }
        )
          .then(() =>
            res.status(200).json({
              message: "L'utilisateur a disliké la sauce !",
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
        break;
      case 0:
        Sauce.findOne({
          _id: sauceId,
        })
          .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) {
              // Si l'utilisateur a liké la sauce et souhaite annuler son avis
              Sauce.updateOne(
                {
                  _id: sauceId,
                },
                {
                  $inc: {
                    likes: -1, // On décrémente le nombre de likes de 1
                  },
                  $pull: {
                    usersLiked: userId, // On retire son id de la BDD
                  },
                  _id: sauceId,
                }
              )
                .then(() =>
                  res.status(200).json({
                    message: "L'utilisateur n'aime plus la sauce",
                  })
                )
                .catch((error) =>
                  res.status(400).json({
                    error,
                  })
                );
            }
            if (sauce.usersDisliked.includes(userId)) {
              // Si l'utilisateur a disliké la sauce et souhaite annuler son avis
              Sauce.updateOne(
                {
                  _id: sauceId,
                },
                {
                  $inc: {
                    dislikes: -1, // On décrémente le nombre de dislikes de 1
                  },
                  $pull: {
                    usersDisliked: userId, // On retire son ID de la BDD
                  },
                  _id: sauceId,
                }
              )
                .then(() =>
                  res.status(200).json({
                    message: "Dislike retiré !",
                  })
                )
                .catch((error) =>
                  res.status(400).json({
                    error,
                  })
                );
            }
          })
          .catch((error) =>
            res.status(404).json({
              error,
            })
          );
        break;
      // Si un utilisateur met un like, alors on incrémente la valeur du nombre de likes et on stocke l'id de l'utilisateur
      case 1:
        Sauce.updateOne(
          {
            _id: sauceId,
          },
          {
            $push: {
              usersLiked: userId,
            }, // On envoie l'id de l'utilisateur à la BDD
            $inc: {
              likes: +1,
            }, // On incrémente le nombre de likes de 1
            _id: sauceId,
          }
        )
          .then(() =>
            res.status(200).json({
              message: "L'utilisateur a liké la sauce !",
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
        break;
    }
  });
};
