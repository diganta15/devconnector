const express = require('express');

const router = express.Router();


//@route    POST api/posts
//@desec   
//@access   Public
router.post('/', (req, res) => {
    res.send('Posts');
});

module.exports = router;