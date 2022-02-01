const db = require("../models");
const auth = require("../_tool/authentificator");
const User = db.user;
const Rank = db.rank;

//#region LOGIN
exports.login = async (req, res) => {
    let user = null;
    await User.findOne({Email: req.body.Email}).then((data) => {
      if(data !== null && data.Email !== null) {
        user = {
          _id:  data._id,
          Email: data.Email,
          Password: data.Password,
          isOnline: data.isOnline,
          isSoftDeleted: data.isSoftDeleted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          Avatar: data.Avatar,
          RankId: data.RankId
        }
      } else {
        res.status(404).send({message: "Impossible de trouver l'utilisateur avec l'email " + req.body.Email})
      }
  })

  if(user !== null && user.RankId !== null) {
    user.Rank  = await Rank.findOne({RankId: user.RankId}).then(data => {
      return data.Name;
    })
  
    if(user !== null) {
     if(!user.isSoftDeleted) {
      if(req.body.Password !== user.Password) {
        res.status(401).send({message: "Nom d'utilisateur ou mot de passe incorrect"})
        return;
      }
      
      const accessToken = auth.generateToken(user);
      res.status(200).send({accessToken});
     } else {
      res.status(404).send({message: "Utilisateur inexistant"})
     }
    }
    else {
      res.status(404)
    }
  }
  else res.status(404);
  
}
//#endregion LOGIN