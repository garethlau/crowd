const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const keys = require("../config/keys");

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
        return res.send({ message: "There was an error." });
      }
      if (!resource) {
        return res.send({message: "Could not find the resource."});
      }
      return res.send({ resource: resource });
    });
  } else if (courseCode && week) {
    // get all resources for a week
    Resource.find({ courseCode: courseCode, week: week }, (err, resources) => {
      if (err) {
        return res.send({ message: "There was an error." });
      }
      return res.send({ resources: resources });
    });
  } else if (courseCode) {
    // get all resources for a course
    Resource.find({ courseCode: courseCode }, (err, resources) => {
      if (err) {
        return res.send({ message: "There was an error." });
        
      }
      return res.send({ resources: resources });
    });
  } else {
    // return nothing, didnt specify enough
    return res.send({ message: "Did not provide enough details." });
  }
});

// create a new resource (course, week)
router.post("/", (req, res) => {
  if (!req.user) {
    return res.send({message: "You must be logged in to create a resource."});
  }
  const {
    courseCode,
    week,
    title,
  } = req.body.resource;
  const content = req.body.resource.content;

  const resource = new Resource({
    courseCode: courseCode.toUpperCase(),
    week: week,
    title: title,
    interactions: {
      upvotes: "0",
      downvotes: "0",
      favs: "0",
    },
    comments: [],
    content: content,
    author: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    },
  });
  console.log(resource);
  resource
    .save()
    .then(savedResource => {
      return res.send({ message: "Resource saved successfully." });
    })
    .catch(err => {
      console.log(err);
      return res.send({ message: "There was an error saving the resource." });
    });
});

// delete a resource (course, week, id)
router.delete("/", (req, res) => {
  const resourceId = req.body.resourceId;
  if (!resourceId) {
    return res.send({ message: "Missing ID." });
  }
  if (!req.user) {
    return res.send({message: "Not authorized to delete this resource."});
  }
  Resource.findOneAndDelete({_id: resourceId, 'author.id': req.user._id}, (err, resource) => {
    if (err) {
      console.log(err);
      return res.send({ message: "There was an error deleting the resource." });
    }
    if (!resource) {
      return res.send({message: "Could not find the resource."})
    }
    return res.send({ message: "Resource successfully deleted." });
  });
});

// edit a resource (course, week, id)
router.put("/", (req, res) => {
  const resourceId = req.body.resourceId;
  const updates = req.body.resource;
  console.log(updates)
  if (!resourceId) {
    return res.send({message: "Missing ID."});
  }
  if (!req.user) {
    return res.send({message: "Not authorized to update this resource."});
  }
  Resource.findOneAndUpdate({_id: resourceId, 'author.id': req.user._id}, {
    week: updates.week,
    title: updates.title,
    content: updates.content,
  }, (err, resource) => {
    if (err) {
      console.log(err);
      return res.send({message: "There was an error updating the resource."});
    }
    console.log(resource);
    if (!resource) {
      return res.send({message: "Could not find the resource."});
    }
    return res.send({message: "Resource successfully updated."})
  })
});
router.post("/create", (req, res) => {

});

module.exports = router;
