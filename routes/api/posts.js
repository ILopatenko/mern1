//Import express
const express = require('express');

//Import router
const router = express.Router();

// @route: GET => api/posts
// @desc: Test route
// @access: Public
router.get('/', (req, res) => res.send('posts route is working ...'));

module.exports = router;