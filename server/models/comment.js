const mongoose = require('mongoose');
const {Schema} = mongoose;

const CommentSchema = new Schema({
    resourceId: String,
    parentId: String,
    author: {
        firstName: String,
        lastName: String,
        id: String
    },
    content: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model("Comment", CommentSchema);