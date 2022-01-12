module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        Email: String,
        Password: String,
        RankId: String,
        isOnline: Boolean,
        isSoftDeleted: Boolean
      },{
        versionKey: false,
        timestamps: true,
        collection: "user",
    });
    
    const User = mongoose.model("user", schema);
    return User;
  };