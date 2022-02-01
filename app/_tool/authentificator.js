const jwt = require('jsonwebtoken');
const db = require('../models')
const User = db.user;

exports.generateToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '86400s'}) //24H
}

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if(!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err)  return res.sendStatus(401);
      User.findOne({Email: user.Email}).then((data) => {
        if(new Date(user.updatedAt).toString() !== data.updatedAt.toString()) 
          return res.sendStatus(401)
        req.user = user;
        next();
      })
    })
}