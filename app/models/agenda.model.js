module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        startDate: Date,
        endDate: Date,
      },{
        versionKey: false,
        collection: "agenda",
    });
    
    const Agenda = mongoose.model("agenda", schema);
    return Agenda;
  };