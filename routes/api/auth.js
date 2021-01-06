//Import express
const express = require('express');

//Import router
const router = express.Router();

//Import a middleware from middleware/auth.js
const auth = require('../../middleware/auth');

//Import a User model from models/User.js
const User = require('../../models/User');

// @route: GET => api/auth
// @desc: Authorization and check a JWT
// @access: Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;