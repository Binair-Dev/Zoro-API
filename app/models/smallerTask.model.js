module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        Description: String,
        TaskId: String,
      },{
        versionKey: false,
        collection: "smallerTask",
    });
    
    const smallerTask = mongoose.model("smallerTask", schema);
    return smallerTask;
  };