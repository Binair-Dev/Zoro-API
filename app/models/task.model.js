module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        CategoryId: String,
        Name: String,
        Description: String,
        AgendaId: String,
        UserId: String,
        Concerning: []
      },{
        versionKey: false,
        collection: "task",
    });
    
    const Task = mongoose.model("task", schema);
    return Task;
  };