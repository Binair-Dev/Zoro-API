require('dotenv').config()
const db = require("../models");
const Task = db.task;

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
  
    if(req.body.Name !== undefined) {

      const dbTask = await Task.findOne({
        CategoryId: req.body.CategoryId,
        Name: req.body.Name,
        Description: req.body.Description,
        AgendaId: req.body.AgendaId,
        UserId: req.body.UserId,
      })
      .then(data => {
        tempRank = new Task({
          _id:  data._id,
          CategoryId: data.CategoryId,
          Name: data.Name,
          Description: data.Description,
          AgendaId: data.AgendaId,
          UserId: data.UserId,
        });
        return tempRank;
      }).catch(err => {
        return null;
      })
      
      const task = new Task({
        CategoryId: req.body.CategoryId,
        Name: req.body.Name,
        Description: req.body.Description,
        AgendaId: req.body.AgendaId,
        UserId: req.body.UserId,
      });

      if(dbTask === null) {
        task
        .save(task)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erreur lors de la création de la tache."
          });
        });
      } else res.status(500).send({message: "Une tache avec cet id est déjà existant !"});
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

    Task.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de la tache."});
      });
  };

  exports.readOne = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    Task.findOne({_id: id})
      .then(data => {
        if (!data)
          res.status(404).send({message: "Impossible de trouver la tache avec l'id suivant: " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erreur pendant la récuperation de la tache avec l'id suivant: " + id });
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

    Task.find({_id: id})
      .then(data => {
        if(data.length > 0) {
          data.forEach(element => {
            if (!element) {
              res.status(404).send({message: "Impossible de mettre a jour la tache avec l'id: " + id + "!"});
            } else{
              element.updateOne({
                CategoryId: req.body.CategoryId, 
                Name: req.body.Name, 
                Description: req.body.Description, 
                AgendaId: req.body.AgendaId, 
                UserId: req.body.UserId, 
              }).then(data => {
                res.status(200).send(data)
              });
            }});
        } else res.status(404).send({message: "Impossible de trouver la tache !"})
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise a jour de la tache avec l'id: " + id
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

    Task.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({message: `Impossible de supprimer la tache avec l'ID: ${id}.`});
        } else {
          res.send({message: "Tache supprimé avec succès!"});
        }
      })
      .catch(err => {
        res.status(500).send({message: `Impossible de supprimer la tache avec l'ID: ${id}.`});
      });
  };

exports.deleteAll = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
  Task.deleteMany({})
      .then(data => {
        res.send({message: `${data.deletedCount} taches ont été supprimés!`});
      })
      .catch(err => {
        res.status(500).send({message: "Erreur durant la suppression des taches."});
      });
  };
//#endregion DELETE