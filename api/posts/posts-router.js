// implement your posts router here
const Post = require("./posts-model");
const express = require("express");
const router = express.Router();

// [GET] /api/posts
router.get("/", (req, res) => {
    Post.find(req)
    .then(posts => {
        res.status(200).json(posts);

    }).catch(error => {
        res.status(500).json( { message: "The posts information could not be retrieved" } )
        console.log(error) 
    })
})

// GET	/api/posts/:id
router.get("/:id", (req, res) => {
    const  id  = req.params.id
    Post.findById(id)
    .then(post => {
        if(!post){
            res.status(404).json( { message: "The post with the specified ID does not exist" } )

        } else {
            res.status(500).json(post)
        }

    }).catch(error => {
        res.status(500).json({ message: error.message })
    })
})