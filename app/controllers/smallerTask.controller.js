require('dotenv').config()
const db = require("../models");
const smallerTask = db.smallerTask;

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
  
    if(req.body.Description !== undefined) {

      const dbSmalerTask = await smallerTask.findOne({Description: req.body.Description})
      .then(data => {
        tempCategory = new Category({
          _id:  data._id,
          Description: data.Description,
          TaskId: data.TaskId
        });
        return tempCategory;
      }).catch(err => {
        return null;
      })
      
      const smallertask = new smallerTask({
        Description: req.body.Description,
        TaskId: req.body.TaskId
      });

      if(dbSmalerTask === null) {
        smallertask
        .save(smallertask)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erreur lors de la création de la sous-tache."
          });
        });
      } else res.status(500).send({message: "Une sous-tache avec cet id est déjà existant !"});
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

    smallerTask.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de de la sous-tache."});
      });
  };

  exports.readOne = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    smallerTask.findOne({_id: id})
      .then(data => {
        if (!data)
          res.status(404).send({message: "Impossible de trouver la sous-tache avec l'id suivant: " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erreur pendant la récuperation de la sous-tache avec l'id suivant: " + id });
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

    smallerTask.find({_id: id})
      .then(data => {
        if(data.length > 0) {
          data.forEach(element => {
            if (!element) {
              res.status(404).send({message: "Impossible de mettre a jour la sous-tache avec l'id: " + id + "!"});
            } else{
              element.updateOne({
                Description: req.body.Description, 
                TaskId: req.body.TaskId, 
              }).then(data => {
                res.status(200).send(data)
              });
            }});
        } else res.status(404).send({message: "Impossible de trouver la sous-tache !"})
        
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise a jour de la sous-tache avec l'id: " + id
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

    smallerTask.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({message: `Impossible de supprimer la sous-tache avec l'ID: ${id}.`});
        } else {
          res.send({message: "sous-tache supprimé avec succès!"});
        }
      })
      .catch(err => {
        res.status(500).send({message: `Impossible de supprimer la sous-tache avec l'ID: ${id}.`});
      });
  };

exports.deleteAll = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
  smallerTask.deleteMany({})
      .then(data => {
        res.send({message: `${data.deletedCount} sous-tache ont été supprimés!`});
      })
      .catch(err => {
        res.status(500).send({message: "Erreur durant la suppression des sous-tache."});
      });
  };
//#endregion DELETE