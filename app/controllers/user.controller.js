require('dotenv').config()
const db = require("../models");
const User = db.user;

//#region CREATE
exports.create = async (req, res) => {
  if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    if (!req.body) {
      res.status(400).send({ message: "Aucune données n'ont été rentrée!" });
      return;
    }
  
    if(req.body.Email !== undefined) {

      const dbUser = await User.findOne({Email: req.body.Email})
      .then(data => {
        console.log(data);
        tempUser = new User({
          _id:  data._id,
          Email: data.Email,
          Password: data.Password,
          RankId: data.RankId,
          isOnline: data.isOnline,
          isSoftDeleted: data.isSoftDeleted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          Avatar: data.Avatar
        });
        return tempUser;
      }).catch(err => {
        return null;
      })
      
      const user = new User({
        Email: req.body.Email,
        Password: req.body.Password,
        RankId: req.body.RankId,
        isOnline: req.body.isOnline,
        isSoftDeleted: req.body.isSoftDeleted,
        Avatar: req.body.Avatar
      });
    
      if(dbUser === null) {
        user
        .save(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erreur lors de la création de l'utilisateur."
          });
        });
      } else res.status(500).send({message: "Un utilisateur avec cet email est déjà existant !"});
    } else {
      res.status(400).send({message: "Aucun contenu reçu."});
    }
  };
//#endregion CREATE

//#region READ
  exports.readAll = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }

    User.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de l'utilisateur."});
      });
  };

  exports.readOne = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    User.findOne({Email: id})
      .then(data => {
        if (!data)
          res.status(404).send({message: "Impossible de trouver l'utilisateur avec l'email suivant: " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erreur pendant la récuperation del'utilisateur avec l'email suivant: " + id });
      });
  };
//#endregion READ

//#region UPDATE
exports.update = (req, res) => {
  const id = req.params.id;
  if(req.user.Email !== id) {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
  }

    if (!req.body) {
      return res.status(400).send({message: "Les données entrées sonts vides!"});
    }
  
    User.find({Email: id})
      .then(data => {
        data.forEach(element => {
        if (!element) {
          res.status(404).send({message: "Impossible de mettre a jour l'utilisateur avec l'id: " + id + "!"});
        } else{
          if(req.user.RankId === "0") {
            element.updateOne({
              Email: req.body.Email, 
              Password: req.body.Password,
              Avatar: req.body.Avatar,
              RankId: req.body.RankId
            }).then(data => {
              res.status(200).send(data)
            });
          } else {
            element.updateOne({
              Email: req.body.Email, 
              Password: req.body.Password,
              Avatar: req.body.Avatar
            }).then(data => {
              res.status(200).send(data)
            });
          }
        }});
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise a jour de l'utilisateur avec l'id: " + id
        });
      });
  };
//#endregion UPDATE

//#region DELETE
exports.delete = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
    const id = req.params.id;

    User.find({_id: id})
      .then(data => {
        data.forEach(element => {
        if (!element) {
          res.status(404).send({message: "Impossible de supprimer l'utilisateur avec l'id: " + id + "!"});
        } else{
          element.updateOne({
            isSoftDeleted: true, 
          }).then(data => {
            res.status(200).send(data)
          });
        }});
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la supression de l'utilisateur avec l'id: " + id
        });
      });
  };

exports.deleteAll = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
    User.deleteMany({})
      .then(data => {
        res.send({message: `${data.deletedCount} utilisateurs ont été supprimés!`});
      })
      .catch(err => {
        res.status(500).send({message: "Erreur durant la suppression des utilisateurs."});
      });
  };
//#endregion DELETE