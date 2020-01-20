const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResourceSchema = new Schema({
  courseCode: String,
  week: String,
  title: String,
  interactions: {
    upvotes: String,
    downvotes: String,
    favs: String
  },
  comments: Array,
  content: Object,
  author: {
    id: String,
    firstName: String,
    lastName: String
  },
  lastModified: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model("Resource", ResourceSchema);
