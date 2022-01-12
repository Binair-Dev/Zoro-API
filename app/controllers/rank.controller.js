require('dotenv').config()
const db = require("../models");
const Rank = db.rank;

//#region CREATE
exports.create = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Aucune données n'ont été rentrée!" });
      return;
    }
  
    if(req.body.Name !== undefined && req.body.RankId !== undefined) {

      const dbRank = await Rank.findOne({Name: req.body.Name})
      .then(data => {
        tempRank = new Rank({
          _id:  data._id,
          Name: data.Name,
          RankId: data.RankId,
        });
        return tempRank;
      }).catch(err => {
        return null;
      })
      
      const rank = new Rank({
        Name: req.body.Name,
        RankId: req.body.RankId,
      });

      if(dbRank === null) {
        rank
        .save(rank)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erreur lors de la création du rang."
          });
        });
      } else res.status(500).send({message: "Un rang avec cet id est déjà existant !"});
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

    Rank.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de du rang."});
      });
  };

  exports.readOne = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    Rank.findOne({Email: id})
      .then(data => {
        if (!data)
          res.status(404).send({message: "Impossible de trouver le rang avec l'id suivant: " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erreur pendant la récuperation du rang avec l'id suivant: " + id });
      });
  };
//#endregion READ

//#region UPDATE
exports.update = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
    if (!req.body) {
      return res.status(400).send({message: "Les données entrées sonts vides!"});
    }
  
    const id = req.params.id;

    Rank.find({RankId: id})
      .then(data => {
        data.forEach(element => {
        if (!element) {
          res.status(404).send({message: "Impossible de mettre a jour le rang avec l'id: " + id + "!"});
        } else{
          element.updateOne({
            Name: req.body.Name, 
          }).then(data => {
            res.status(200).send(data)
          });
        }});
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise a jour du rang avec l'id: " + id
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

    Rank.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({message: `Impossible de supprimer le rang avec l'ID: ${id}.`});
        } else {
          res.send({message: "Rang supprimé avec succès!"});
        }
      })
      .catch(err => {
        res.status(500).send({message: `Impossible de supprimer le rang avec l'ID: ${id}.`});
      });
  };

exports.deleteAll = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
  Rank.deleteMany({})
      .then(data => {
        res.send({message: `${data.deletedCount} rang ont été supprimés!`});
      })
      .catch(err => {
        res.status(500).send({message: "Erreur durant la suppression des rangs."});
      });
  };
//#endregion DELETE