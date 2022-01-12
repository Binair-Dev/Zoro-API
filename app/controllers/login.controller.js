const db = require("../models");
const auth = require("../_tool/authentificator");
const User = db.user;

//#region LOGIN
exports.login = async (req, res) => {
    User.findOne({Email: req.body.Email}).then((data) => {
      if(data !== null && data.Email !== null) {
        let user = {
          _id:  data._id,
          Email: data.Email,
          Password: data.Password,
          RankId: data.RankId,
          isOnline: data.isOnline,
          isSoftDeleted: data.isSoftDeleted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        }
        if(user !== null) {
          if(req.body.Password !== user.Password) {
            res.status(401).send({message: "Nom d'utilisateur ou mot de passe incorrect"})
            return;
          }
          
          const accessToken = auth.generateToken(user);
          res.status(200).send({accessToken});
        }
        else {
          res.status(404).send("Not found")
        }
      } else {
        res.status(404).send({message: "Impossible de trouver l'utilisateur avec l'email " + req.body.Email})
      }
  })
}
//#endregion LOGIN