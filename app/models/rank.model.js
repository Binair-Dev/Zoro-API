module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        Name: String,
        RankId: Number
      },{
        versionKey: false,
        collection: "rank",
    });
    
    const Rank = mongoose.model("rank", schema);
    return Rank;
  };