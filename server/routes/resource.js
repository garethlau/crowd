const express = require("express");
const router = express.Router();

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const Grid = require("gridfs-stream");
eval(
  `Grid.prototype.findOne = ${Grid.prototype.findOne
    .toString()
    .replace("nextObject", "next")}`
);

const mongoose = require("mongoose");
const Resource = mongoose.model("Resource");
const Vote = mongoose.model("Vote");

const keys = require("../config/keys");
const url = keys.mongoURI;

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// create storage object
const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    console.log("file in storage is", file);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // const filename = buf.toString("hex") + path.extname(file.originalname);
        const filename = file.originalname; // keep the original file name
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        console.log("file is", file);
        resolve(fileInfo);
      });
    });
  }
});

// set multer storage engine
const upload = multer({ storage });

// upload files
router.post(
  "/file",
  (req, res, next) => {
    // check if the user is logged in
    if (!req.user) {
      return res.status(401).send({ message: "You must be logged in." });
    } else {
      return next();
    }
  },
  // upload the file
  upload.array("files"),
  (req, res) => {
    // get the ids for the files
    console.log("File upload endpoint reached", req.files);
    const uploadedFiles = req.files;
    let fileIds = [];
    uploadedFiles.forEach(file => {
      fileIds.push({
        filename: file.filename,
        contentType: file.contentType,
        id: file.id
      });
    });
    const { courseCode, week, title } = req.body;
    console.log(req.body);
    if (!courseCode || !week || !title) {
      return res.status(400).send({ message: "Missing information." });
    }
    const content = {
      data: fileIds,
      type: "FILE"
    };

    // make a new resource object with the id of the file as the content
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
    // save the resource
    resource
      .save()
      .then(savedResource => {
        console.log("saved resources are", savedResource);
        return res.status(200).send({ message: "Files uploaded." });
      })
      .catch(err => {
        console.log("There was an error", err);
        return res
          .status(500)
          .send({ message: "There was an error.", err: err });
      });
  }
);

router.get("/file/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  if (!fileId) {
    return res.status(400).send({ message: "Missing information." });
  }
  gfs.findOne({ _id: fileId }, (err, file) => {
    if (err) {
      return res.status(500).send({ message: "There was an error." });
    }
    if (!file) {
      return res.status(404).send({ message: "Did not find file." });
    }
    res.set("Content-Type", file.contentType);
    res.set(
      "Content-Disposition",
      'attachment; filename="' + file.filename + '"'
    );
    const readStream = gfs.createReadStream(file.filename);
    readStream.on("error", err => {
      console.log("Readstream error", err);
      res.end();
    });
    return readStream.pipe(res);
  });
});

// get upvotes / downvotes for a resource
router.get("/voting", (req, res) => {
  const resourceId = req.query.resourceId;
  Vote.find(
    {
      parentId: resourceId
    },
    (err, documents) => {
      if (err) {
        return res.status(500).send();
      }
      let count = 0;
      let upvoted = false;
      let downvoted = false;

      if (documents.length != 0) {
        count = documents.reduce((acc, curr) => {
          if (req.user) {
            // check if the current user has favourited this resource
            console.log(curr);
            if (curr.author.id == req.user._id && curr.isUpvote) {
              upvoted = true;
            }
            else if (curr.author.id == req.user._id && !curr.isUpvote) {
              downvoted = true;
            }
          }
          return curr.isUpvote ? ++acc : --acc;
        }, 0);
      }

      return res
        .status(200)
        .send({
          message: "Got documents.",
          count: count,
          upvoted: upvoted,
          downvoted: downvoted
        });
    }
  );
});

// upvote / downvote a resource
router.post("/voting", (req, res) => {
  console.log("GOT REQ");
  console.log(req.body);
  if (!req.user) {
    return res.status(401).send({ message: "You must be logged in." });
  }
  const resourceId = req.body.resourceId;
  const type = req.body.type;
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
        // user has already voted
        let vote = documents[0];
        console.log("vote", vote, type);
        if (
          (vote.isUpvote && type == "up") ||
          (!vote.isUpvote && type == "dn")
        ) {
          console.log("already voted", vote);
          // remove the vote
          Vote.findByIdAndDelete(vote._id, (err, doc) => {
            if (err) {
              return res.status(500).send({message: "There was an issue removing the vote."});
            }
            else {
              return res.status(200).send({message: "Vote removed."});
            }
          })
        } else {
          // switch the vote
          vote.isUpvote = !vote.isUpvote;
          // save the vote
          vote
            .save()
            .then(() => {
              res.status(200).send({ message: "Vote switched." });
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

// delete a resource (id)
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
      console.log(resource);
      if (resource.content.type == "FILE") {
        // delete attached files

        console.log("delete attached files", resource.content.data);

        let promises = resource.content.data.map(file => {
          return new Promise((resolve, reject) => {
            gfs.remove({ _id: file.id, root: "uploads" }, err => {
              if (err) {
                reject("There was an error removing file " + file.id);
              } else {
                resolve("Removed file " + file.id);
              }
            });
          });
        });

        Promise.all(promises)
          .then(values => {
            console.log("deleted files", values);
            return res
              .status(200)
              .send({ message: "Resource and files deleted successfully." });
          })
          .catch(err => {
            console.log("ther was an error deleting iles", err);
            return res.status(500).send();
          });
      } else {
        return res
          .status(200)
          .send({ message: "Resource successfully deleted." });
      }
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
