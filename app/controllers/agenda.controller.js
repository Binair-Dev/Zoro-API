require('dotenv').config()
const db = require("../models");
const Agenda = db.agenda;

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
  
    if(req.body.TaskId !== null) {
      const dbAgenda = await Agenda.findOne({Name: req.body.TaskId})
      .then(data => {
        tempAgenda = new Agenda({
          _id:  data._id,
          startDate: data.startDate,
          endDate: data.endDate,
        });
        return tempAgenda;
      }).catch(err => {
        return null;
      })
      
      const agenda = new Agenda({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });

      if(dbAgenda === null) {
        agenda
        .save(agenda)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erreur lors de la création de l'agenda."
          });
        });
      } else res.status(500).send({message: "Un agenda avec cet id est déjà existant !"});
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

    Agenda.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de de l'agenda."});
      });
  };

  exports.readOne = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    Agenda.findOne({_id: id})
      .then(data => {
        if (!data)
          res.status(404).send({message: "Impossible de trouver l'agenda avec l'id suivant: " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erreur pendant la récuperation de l'agenda avec l'id suivant: " + id });
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

    Agenda.find({_id: id})
      .then(data => {
        if(data.length > 0) {
          data.forEach(element => {
            if (!element) {
              res.status(404).send({message: "Impossible de mettre a jour l'agenda avec l'id: " + id + "!"});
            } else{
              element.updateOne({
                startDate: req.body.startDate, 
                endDate: req.body.endDate, 
              }).then(data => {
                res.status(200).send(data)
              });
            }});
        } else res.status(404).send({message: "Impossible de trouver l'agenda !"})
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise a jour de l'agenda avec l'id: " + id
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
    
    Agenda.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({message: `Impossible de supprimer l'agenda avec l'ID: ${id}.`});
        } else {
          res.send({message: "Agenda supprimé avec succès!"});
        }
      })
      .catch(err => {
        res.status(500).send({message: `Impossible de supprimer l'agenda avec l'ID: ${id}.`});
      });
  };

exports.deleteAll = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
  Agenda.deleteMany({})
      .then(data => {
        res.send({message: `${data.deletedCount} agendas ont été supprimés!`});
      })
      .catch(err => {
        res.status(500).send({message: "Erreur durant la suppression des agendas."});
      });
  };
//#endregion DELETE