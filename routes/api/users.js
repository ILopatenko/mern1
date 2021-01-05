//Import express
const express = require('express');

//Import router
const router = express.Router();

// @route: GET => api/users
// @desc: Test route
// @access: Public
router.get('/', (req, res) => res.send('User route is working ...'));

module.exports = router;