const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResourceSchema = new Schema({
  courseCode: String,
  week: String,
  title: String,
  datePosted: String,
  upvotes: String,
  downvotes: String,
  comments: Array,
  contentType: String,
  content: String,
  author: String
});

module.exports = mongoose.model("Resource", ResourceSchema);
