// implement your posts router here
const Post = require("./posts-model");
const express = require("express");
const router = express.Router();

// [GET] /api/posts
router.get('/', (req, res) => {
    Post.find(req)
    .then(posts => {
        res.status(200).json(posts)

    }).catch(error => {
        res.status(500).json( { message: "The posts information could not be retrieved" } )
        console.log(error);
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

// POST	/api/posts
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Post.insert({title, contents})
            .then(({id}) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: 'There was an error while saving the post to the database'
                })
            })
    }
})

// 	PUT	/api/posts/:id
router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            } else {
                return Post.update(req.params.id, req.body)
            }
        })
        .then(input => {
            if (input) {
                return Post.findById(req.params.id)
            }
        })
        .then(post => {
            if (post) {
                res.json(post)
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "The post information could not be modified"
            })
        })
    }
})

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'The post could not be removed'
        })
    }
})

// GET /api/posts/:id/comments
router.get('/:id/messages', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            const comments = await Post.findPostComments(req.params.id)
            res.json(comments)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'The comments information could not be retrieved'
        })
    }
})


module.exports = router 