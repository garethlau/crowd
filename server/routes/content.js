const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    console.log("content")
    res.send("test")
    /*
    Load the general page
    */
})

router.get("/create", (req, res) => {
	console.log();
	res.json({"test":"create page"});
})

router.post("/create", (req, res)=> {
	console.log(req.body);
	res.json({"test": "create content"});
})

router.get("/:id", (req, res) => {
    console.log(req.params.id)
    res.send(req.params.id)
})

module.exports = router;
