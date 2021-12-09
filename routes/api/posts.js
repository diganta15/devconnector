const express = require('express');

const router = express.Router();


//@route    POST api/posts
//@desec   Login user
//@access   Public
router.get('/', (req, res) => {
    res.send('Posts');
});

module.exports = router;