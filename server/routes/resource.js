const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const keys = require("../config/keys");

router.get("");

// get all resources for a course
// get all resources for a week (course, week)
// get a single resource (course, week, id)
router.get("/", (req, res) => {
  console.log(req.query);
  const courseCode = req.query.courseCode;
  const week = req.query.week;
  const resourceId = req.query.id;
  if (courseCode && weekNumber && resourceId) {
    // get a single resource
    Resource.findById(resourceId, (err, resource) => {
      if (err) {
        res.send({ message: "There was an error." });
        return;
      }
      res.send({resource: resource});
    });
  } else if (courseCode && week) {
    // get all resources for a week
    Resource.find({courseCode: courseCode, week: week}, (err, resources) => {
        if (err) {
            res.send({message: "There was an error."});
            return;
        }
        res.send({resources: resources});
    })
  } else if (courseCode) {
    // get all resources for a course
    Resource.find({courseCode: courseCode}, (err, resources) => {
        if (err) {
            res.send({message: "There was an error."});
            return;
        }
        res.send({resources: resources});
    })
  } else {
    // return nothing, didnt specify enough
    res.send({message: "Did not provide enough details."});
}
});

// create a new resource (course, week)
router.post('/', (req, res) => {
    
})
// delete a resource (course, week, id)

// edit a resource (course, week, id)
module.exports = router;
