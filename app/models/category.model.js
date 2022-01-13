module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        Name: String,
        CategoryId: Number,
      },{
        versionKey: false,
        collection: "category",
    });
    
    const Category = mongoose.model("category", schema);
    return Category;
  };