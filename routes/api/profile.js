//Import express
const express = require('express');

//Import router
const router = express.Router();

// @route: GET => api/profile
// @desc: Test route
// @access: Public
router.get('/', (req, res) => res.send('Profile route is working ...'));

module.exports = router;