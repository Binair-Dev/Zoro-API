module.exports = app => {
    const controller = require("../controllers/login.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", controller.login);
  
    app.use('/api/login', router);
  };