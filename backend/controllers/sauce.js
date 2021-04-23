// Récupération du modèle sauces
const Sauce = require("../models/Sauce");

// Import de fs qui permet d'accéder au file-system (pour l'enregistrement d'images)
const fs = require("fs");

exports.createSauce = (req, res, next) => { // Middleware permettant la création d'une nouvelle sauce
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`,
    likes: 0, // Initialisation à 0 likes
    dislikes: 0, // Initialisation à 0 dislikes
    usersLiked: [], // Initialisation du tableau vide car personne n'a encore donné son avis
    usersDisliked: [],
  });
  sauce
    .save() // On sauvegarde la sauce nouvellement créée
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" })) // Si tout a bien fonctionné, on renvoie un code 201 (document créé)
    .catch((error) => res.status(400).json({ error: error })); // Sinon erreur 400
};

exports.modifySauce = (req, res, next) => { // Middleware servant à la modification d'une sauce
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
    .then(() => res.status(200).json({ message: "Objet modifié !" })) // Si tout fonctionne, on renvoie un code 200
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => { // Middleware servant à supprimer la sauce
  Sauce.findOne({ _id: req.params.id }) // On récupère la sauce souhaitée grâce à son ID
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // On supprime l'image enregistrée
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // On supprime l'objet
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error })); // Si l'id recherché ne donne pas de résultat, on renvoie une erreur 500
};

exports.getOneSauce = (req, res, next) => { // Récupération d'une sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => { // Récupération de toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateSauce = (req, res, next) => { // Middleware servant à donner un avis sur une sauce
  let like = req.body.like;

  let userId = req.body.userId; // On prend le userID

  let sauceId = req.params.id; // On prend l'id de la sauce

  Sauce.findOne({ _id: sauceId }).then((sauce) => { // On récupère la sauce à noter
    switch (like) {
      case -1: // L'utilisateur dislike
        Sauce.updateOne(  // Si un utilisateur met un dislike, alors on incrémente la valeur du nombre de dislikes et on stocke l'id de l'utilisateur
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
      case 0: // L'utilisateur retire son avis
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
      case 1: // L'utilisateur like
        Sauce.updateOne( // Si un utilisateur met un like, alors on incrémente la valeur du nombre de likes et on stocke l'id de l'utilisateur
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
