require('dotenv').config()
const db = require("../models");
const Category = db.category;

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
  
    if(req.body.Name !== undefined && req.body.CategoryId !== undefined) {

      const dbCategory = await Category.findOne({Name: req.body.Name})
      .then(data => {
        tempCategory = new Category({
          _id:  data._id,
          Name: data.Name,
          CategoryId: data.CategoryId,
        });
        return tempCategory;
      }).catch(err => {
        return null;
      })
      
      const category = new Category({
        Name: req.body.Name,
        CategoryId: req.body.CategoryId,
      });

      if(dbCategory === null) {
        category
        .save(category)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Erreur lors de la création de la catégorie."
          });
        });
      } else res.status(500).send({message: "Une catégorie avec cet id est déjà existant !"});
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

    Category.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({message: "Erreur lors de la récupération de de la catégorie."});
      });
  };

  exports.readOne = (req, res) => {
    if(req.user.RankId !== "0") {
      res.status(401).send({message: "Non authorisé"})
      return;
    }
    const id = req.params.id;
  
    Category.findOne({Email: id})
      .then(data => {
        if (!data)
          res.status(404).send({message: "Impossible de trouver la catégorie avec l'id suivant: " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erreur pendant la récuperation de la catégorie avec l'id suivant: " + id });
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

    Category.find({CategoryId: id})
      .then(data => {
        if(data.length > 0) {
          data.forEach(element => {
            if (!element) {
              res.status(404).send({message: "Impossible de mettre a jour la catégorie avec l'id: " + id + "!"});
            } else{
              element.updateOne({
                Name: req.body.Name, 
              }).then(data => {
                res.status(200).send(data)
              });
            }});
        } else res.status(404).send({message: "Impossible de trouver la catégorie !"})
        
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la mise a jour de la catégorie avec l'id: " + id
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

    Category.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({message: `Impossible de supprimer la catégorie avec l'ID: ${id}.`});
        } else {
          res.send({message: "Catégorie supprimé avec succès!"});
        }
      })
      .catch(err => {
        res.status(500).send({message: `Impossible de supprimer la catégorie avec l'ID: ${id}.`});
      });
  };

exports.deleteAll = (req, res) => {
  if(req.user.RankId !== "0") {
    res.status(401).send({message: "Non authorisé"})
    return;
  }
  Category.deleteMany({})
      .then(data => {
        res.send({message: `${data.deletedCount} catégorie ont été supprimés!`});
      })
      .catch(err => {
        res.status(500).send({message: "Erreur durant la suppression des catégorie."});
      });
  };
//#endregion DELETE