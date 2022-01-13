const { authenticateToken } = require("../_tool/authentificator.js");

module.exports = app => {
    const user = require("../controllers/smallerTask.controller.js");
  
    var secured = require("express").Router();
  
    secured.post("/", user.create);
    secured.get("/", user.readAll);
    secured.get("/:id", user.readOne);
    secured.put("/:id", user.update);
    secured.delete("/:id", user.delete);
    secured.delete("/", user.deleteAll);
  
    app.use('/api/smallerTask', authenticateToken, secured);
  };