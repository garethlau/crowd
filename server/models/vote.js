const mongoose = require('mongoose');
const {Schema} = mongoose;

const VoteSchema = new Schema({
    parentId: String,
    author: {
        firstName: String,
        lastName: String,
        id: String
    },
    isUpvote: Boolean,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model("Vote", VoteSchema);