const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const Vote = mongoose.model("Vote");
const Comment = mongoose.model("Comment");

// base route is /api/v1/comment

// get comments for a resource (resourceId), first level
router.get("/", (req, res) => {
  const resourceId = req.query.id;
  const parentId = req.query.parentId || null; // if the parentId is null, then we are looking for top level comments

  if (resourceId) {
    Comment.find(
      { resourceId: resourceId, parentId: parentId },
      null,
      { sort: { updated_at: -1 } },
      (err, comments) => {
        if (err) {
          return res.status(500).send({ message: "There was an error." });
        }
        return res.status(200).send({ comments: comments });
      }
    );
  } else {
    // missing resource id
    return res.status(400).send({ message: "Missing ID." });
  }
});

// post comment (content, user, id of the resource)
router.post("/", (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .send({ message: "You must be logged in to comment." });
  }
  const resourceId = req.query.id;
  const parentId = req.query.parentId || null;
  if (!resourceId) {
    return res.status(400).send({ message: "Missing ID." });
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
    content: req.body.content
  });
  // save comment
  comment
    .save()
    .then(savedComment => {
      return res.status(200).send({ message: "Comment added." });
    })
    .catch(err => {
      return res.status(500).send({ message: "Error adding comment." });
    });
});

// delete comment (id, user)
router.delete("/", (req, res) => {});

// get upvote / downvote count
router.get("/voting", (req, res) => {
  const commentId = req.query.commentId;
  Vote.find(
    {
      parentId: commentId
    },
    (err, votes) => {
      if (err) {
        return res.status(500).send({ message: "There was an error." });
      }
      // votes is an array
      let count = 0;
      if (votes.length != 0) {
        count = votes.reduce((acc, curr) => {
          return curr.isUpvote ? ++acc : --acc
        }, 0);
      }
      return res.status(200).send({ message: "Votes counted.", count: count });
    }
  );
});

// upvote, downvote, or reply to a comment
/*
1. check if the user is logged in
2. Check Votes for votes with parentId = commentId and author = req.user._id
    if already voted, dont do anything
    if opposite vote, flip the vote
    else vote by whatever
*/
router.post("/voting", (req, res) => {
  const commentId = req.body.commentId;
  const type = req.body.vote; // 'up' || 'dn'
  if (!req.user) {
    return res.status(401).send({ message: "You must be logged in." });
  }
  if (!commentId) {
    return res.status(400).send({ message: "Missing ID." });
  }
  const userId = req.user._id;
  Vote.find(
    {
      parentId: commentId,
      "author.id": userId
    },
    (err, documents) => {
      if (err) {
        return res.status(500).send({ message: "There was an error." });
      }
      if (documents.length == 0) {
        // new vote
        let newVote = new Vote({
          parentId: commentId,
          author: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            id: userId
          },
          isUpvote: type == "up" ? true : false
        });
        newVote
          .save()
          .then(savedVote => {
            // successfully saved new vote
            return res.status(200).send({ message: "Voted." });
          })
          .catch(err => {
            // error saving new vote
            return res.status(500).send({ message: "There was an error." });
          });
      } else {
        // already voted
        let vote = documents[0];
        if (
          (vote.isUpvote && type == "up") ||
          (!vote.isUpvote && type == "dn")
        ) {
          // user already upvoted or downvoted, don't do anything
          return res.status(200).send({ message: "Already voted." });
        } else {
          // toggle
          vote.isUpvote = !vote.isUpvote;
          // save changes
          vote
            .save()
            .then(savedVote => {
              // successfully saved vote change
              return res.status(200).send({ message: "Vote changed." });
            })
            .catch(err => {
              // error saving vote change
              return res.status(500).send({ message: "There was an error." });
            });
        }
      }
    }
  );
});

// edit comment (id, user)
router.put("/", (req, res) => {
  const commentId = req.query.commentId;
  if (!commentId) {
    return res.status(400).send({ message: "Missing ID." });
  }
  if (!req.user) {
    return res.status(401).send({ message: "You must be logged in." });
  }
  Comment.findOneAndUpdate(
    { _id: commentId, "author.id": req.user._id },
    {
      content: req.body.content
    },
    (err, comment) => {
      if (err) {
        return res.status(500).send({ message: "There was an error." });
      }
      if (!comment) {
        return res.status(404).send({ message: "Could not find comment." });
      }
      return res.status(200).send({ message: "Comment updated." });
    }
  );
});

module.exports = router;
