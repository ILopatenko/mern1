//Import express
const express = require('express');

//Import router
const router = express.Router();

// @route: GET => api/auth
// @desc: Test route
// @access: Public
router.get('/', (req, res) => res.send('Auth route is working ...'));

module.exports = router;