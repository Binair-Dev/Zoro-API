require('dotenv').config()
const db = require("../models");
const Task = db.task;
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
  
    if(req.body.Name !== undefined) {

      const dbTask = await Task.findOne({
        CategoryId: req.body.CategoryId,
        Name: req.body.Name,
        Description: req.body.Description,
        AgendaId: req.body.AgendaId,
        UserId: req.body.UserId,
        Concerning: req.body.Concerning
      })
      .then(data => {
        tempRank = new Task({
          _id:  data._id,
          CategoryId: data.CategoryId,
          Name: data.Name,
          Description: data.Description,
          AgendaId: data.AgendaId,
          UserId: data.UserId,
          Concerning: data.Concerning
        });
        return tempRank;
      }).catch(err => {
        return null;
      })

      const agenda = new Agenda({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      })

      const task = new Task({
        CategoryId: req.body.CategoryId,
        Name: req.body.Name,
        Description: req.body.Description,
        UserId: req.body.UserId,
        Concerning: req.body.Concerning,
      });

      if(dbTask === null) {
        agenda
        .save(agenda)
        .then(data => {
            task.AgendaId = data._id;
            task
            .save(task)
            .then(data => {
              data.AgendaId = data._id;
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Erreur lors de la création de la tache."
              });
            });
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
  exports.readAll = async (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }

    let taskList = [];
    await Task.find()
      .then(data => {
        data.forEach(async(element) => {
          await Agenda.find({_id: element.AgendaId}).then(data => {
            element = {
              _id: element._id,
              CategoryId: element.CategoryId,
              Name: element.Name,
              Description: element.Description,
              UserId: element.UserId,
              Concerning: element.Concerning,
              Agenda: {startDate: data[0].startDate, endDate: data[0].endDate},
            }
            taskList.push(element);
          }).catch(err => {
            res.status(500).send({message: "Erreur lors de la récupération de la tache."});
          });
          res.send(taskList)
        });
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de la tache."});
      });

  };

  exports.readOne = async(req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    await Task.find({_id: id})
      .then( async (dataTask) => {
        await Agenda.find({_id: dataTask[0].AgendaId}).then(data => {
          dataTask[0] = {
            _id: dataTask[0]._id,
            CategoryId: dataTask[0].CategoryId,
            Name: dataTask[0].Name,
            Description: dataTask[0].Description,
            UserId: dataTask[0].UserId,
            Concerning: dataTask[0].Concerning,
            Agenda: {startDate: data[0].startDate, endDate: data[0].endDate},
          }
          res.send(dataTask[0])
        }).catch(err => {
          res.status(500).send({message: "Erreur lors de la récupération de la tache."});
        });
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de la tache."});
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
                Concerning: req.body.Concerning, 
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
exports.delete = async (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
    const id = req.params.id;
    let agendaId = null;
    await Task.findOne({_id: id}).then(data => {
      if(data)
      agendaId = data.AgendaId;
    })

    Agenda.findByIdAndRemove(agendaId)
      .then(data => {
        if (!data) {
          res.status(404).send({message: `Impossible de supprimer la tache avec l'ID: ${id}.`});
        } else {
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