module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        Description: String,
        TaskId: String,
        Status: Boolean
      },{
        versionKey: false,
        collection: "smallerTask",
    });
    
    const smallerTask = mongoose.model("smallerTask", schema);
    return smallerTask;
  };