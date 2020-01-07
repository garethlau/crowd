const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const Comment = mongoose.model("Comment");

// base route is /api/v1/comment



// get comments for a resource (resourceId), first level
router.get("/", (req, res) => {
    const resourceId = req.query.id;
    const parentId = req.query.parentId || null;    // if the parentId is null, then we are looking for top level comments

    if (resourceId) {
        Comment.find({resourceId: resourceId, parentId: parentId}, null, {sort: {'updated_at': -1}}, (err, comments) => {
            if (err) {
                return res.status(500).send({message: "There was an error."});
            }
            return res.status(200).send({comments: comments});
        });
    }
    else {
        // missing resource id
        return res.status(400).send({message: "Missing ID."});
    }
});



// post comment (content, user, id of the resource)
router.post("/", (req, res) => {
    if (!req.user) {
        return res.status(401).send({message: "You must be logged in to comment."});
    }
    const resourceId = req.query.id;
    const parentId = req.query.parentId || null;
    if (!resourceId) {
        return res.status(400).send({message: "Missing ID."});
    }
    // create comment 
    let comment = new Comment({
        resourceId: resourceId,
        parentId: parentId,
        author: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            id: req.user._id
        },
        content: req.body.content,
    })
    console.log(comment);
    // save comment
    comment
        .save()
        .then(savedComment => {
            console.log(savedComment);
            return res.status(200).send({message: "Comment added."});
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({message: "Error adding comment."});
        });
});

// delete comment (id, user)
router.delete("/", (req, res) => {

})

// edit comment (id, user)
router.put("/", (req, res) => {
    const commentId = req.query.commentId;
    console.log(commentId);
    if (!commentId) {
        return res.status(400).send({message: "Missing ID."});
    }
    if (!req.user) {
        return res.status(401).send({message: "You must be logged in."});
    }
    Comment.findOneAndUpdate({_id: commentId, 'author.id': req.user._id}, {
        content: req.body.content
    }, (err, comment) => {
        if (err) {
            return res.status(500).send({message: "There was an error."});
        }
        if (!comment) {
            return res.status(404).send({message: "Could not find comment."});
        }
        return res.status(200).send({message: "Comment updated."});
    });    
});



module.exports = router;