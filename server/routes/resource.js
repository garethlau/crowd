const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const Vote = mongoose.model("Vote");
const keys = require("../config/keys");

// get upvotes / downvotes for a resource
router.get("/voting", (req, res) => {
  const resourceId = req.query.resourceId;
  Vote.find({
    parentId: resourceId
  }, (err, documents) => {
    if (err) {
      return res.status(500).send();
    }
    let count = 0;
    if (documents.length != 0) {
      count = documents.reduce((acc, curr) => {
        return curr.isUpvote ? ++acc : --acc;
      }, 0);
    }
    return res.status(200).send({message: "Votes counted.", count: count});
  })
})

// upvote / downvote a resource
router.post("/voting", (req, res) => {
  console.log("GOT REQ");
  console.log(req.body);
  if (!req.user) {
    return res.status(401).send({ message: "You must be logged in." });
  }
  const resourceId = req.body.resourceId;
  const type = req.body.vote;
  if (!resourceId) {
    return res.status(400).send({ message: "Missing information." });
  }
  const userId = req.user._id;
  Vote.find(
    {
      parentId: resourceId,
      "author.id": userId
    },
    (err, documents) => {
      if (err) {
        return res.status(500).send();
      }
      if (documents.length == 0) {
        // user hasnt voted on this resource before, new vote
        let newVote = new Vote({
          parentId: resourceId,
          author: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            id: userId
          },
          isUpvote: type == "up" ? true : false
        });
        newVote
          .save()
          .then(() => {
            return res.status(200).send({ message: "Voted." });
          })
          .catch(() => {
            return res.status(500).send();
          });
      } else {
        // user has already voted, change the vote
        let vote = documents[0];
        if (
          (vote.isUpvote && type == "up") ||
          (!vote.isUpvote && type == "dn")
        ) {
          return res.status(200).send({ message: "Already voted." });
        } else {
          // switch the vote
          vote.isUpvote = !vote.isUpvote;
          // save the vote
          vote
            .save()
            .then(() => {
              res.status(200).send({ messaeg: "Vote saved." });
            })
            .catch(err => {
              console.log(err);
              return res.status(500).send();
            });
        }
      }
    }
  );
});

// get all resources for a course
// get all resources for a week (course, week)
// get a single resource (course, week, id)
router.get("/", (req, res) => {
  console.log(req.query);
  const courseCode = req.query.courseCode;
  const week = req.query.week;
  const resourceId = req.query.id;
  if (resourceId) {
    // get a single resource
    Resource.findById(resourceId, (err, resource) => {
      if (err) {
        return res.status(500).send({ message: "There was an error." });
      }
      if (!resource) {
        return res
          .status(404)
          .send({ message: "Could not find the resource." });
      }
      return res.status(200).send({ resource: resource });
    });
  } else if (courseCode && week) {
    // get all resources for a week
    Resource.find({ courseCode: courseCode, week: week }, (err, resources) => {
      if (err) {
        return res.status(500).send({ message: "There was an error." });
      }
      return res.status(200).send({ resources: resources });
    });
  } else if (courseCode) {
    // get all resources for a course
    Resource.find({ courseCode: courseCode }, (err, resources) => {
      if (err) {
        return res.status(500).send({ message: "There was an error." });
      }
      return res.status(200).send({ resources: resources });
    });
  } else {
    // return nothing, didnt specify enough
    return res.status(400).send({ message: "Did not provide enough details." });
  }
});

// create a new resource (course, week)
router.post("/", (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .send({ message: "You must be logged in to create a resource." });
  }
  const { courseCode, week, title } = req.body.resource;
  const content = req.body.resource.content;

  const resource = new Resource({
    courseCode: courseCode.toUpperCase(),
    week: week,
    title: title,
    interactions: {
      upvotes: "0",
      downvotes: "0",
      favs: "0"
    },
    comments: [],
    content: content,
    author: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    }
  });
  console.log(resource);
  resource
    .save()
    .then(savedResource => {
      return res.status(200).send({ message: "Resource saved successfully." });
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .send({ message: "There was an error saving the resource." });
    });
});

// delete a resource (course, week, id)
router.delete("/", (req, res) => {
  const resourceId = req.body.resourceId;
  if (!resourceId) {
    return res.status(400).send({ message: "Missing ID." });
  }
  if (!req.user) {
    return res
      .status(401)
      .send({ message: "Not authorized to delete this resource." });
  }
  Resource.findOneAndDelete(
    { _id: resourceId, "author.id": req.user._id },
    (err, resource) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "There was an error deleting the resource." });
      }
      if (!resource) {
        return res
          .status(404)
          .send({ message: "Could not find the resource." });
      }
      return res
        .status(200)
        .send({ message: "Resource successfully deleted." });
    }
  );
});

// edit a resource (course, week, id)
router.put("/", (req, res) => {
  const resourceId = req.body.resourceId;
  const updates = req.body.resource;
  console.log(updates);
  if (!resourceId) {
    return res.status(400).send({ message: "Missing ID." });
  }
  if (!req.user) {
    return res
      .status(401)
      .send({ message: "Not authorized to update this resource." });
  }
  Resource.findOneAndUpdate(
    { _id: resourceId, "author.id": req.user._id },
    {
      week: updates.week,
      title: updates.title,
      content: updates.content
    },
    (err, resource) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "There was an error updating the resource." });
      }
      console.log(resource);
      if (!resource) {
        return res
          .status(404)
          .send({ message: "Could not find the resource." });
      }
      return res
        .status(200)
        .send({ message: "Resource successfully updated." });
    }
  );
});

module.exports = router;
